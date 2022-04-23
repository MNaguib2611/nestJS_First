import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
// import { Controller } from './.controller';
// import { Service } from './.service';

const mockUser = {id:10 ,username:'Naguib'};
const mockTaskRepository = () =>({
    getAllTasks: jest.fn(), 
    findOne: jest.fn(), 
    getTaskById: jest.fn(),
    createTasks:jest.fn(),
    delete:jest.fn(),
    updateTaskById:jest.fn(),
    
});


describe("TasksService",()=>{
    let tasksService;
    let tasksRepository;
    beforeEach(async() =>{
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository,useFactory: mockTaskRepository}
            ]
        }).compile();
        tasksService = await module.get<TasksService>(TasksService);
        tasksRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getAllTasks',() => {
        it('gets all tasks from repository', async () => {
            tasksRepository.getAllTasks.mockResolvedValue('someValue');
            
            expect(tasksRepository.getAllTasks).not.toHaveBeenCalled();
            const filters: GetTaskFilterDTO = {status: TaskStatus.IN_PROGRESS,search:'Some search query'}
            const results =await tasksService.getAllTasks(filters,mockUser);
            expect(tasksRepository.getAllTasks).toHaveBeenCalled();
            expect(results).toEqual('someValue');
        });
    });
    describe('getTaskById',  () => {

        it('calls tasksRepository.findOne() and retrieves the task successfully',async ()=> {
            
            const mockTask = {title: "title",description: "description"};
            tasksRepository.findOne.mockResolvedValue(mockTask);
        
           const result = await tasksService.getTaskById(1,mockUser);
           expect(result).toEqual(mockTask);

           expect(tasksRepository.findOne).toHaveBeenCalledWith({
               where: {
                   id: 1,
                   userId: mockUser.id,
               }
           });
        });
        it('throws an error as task is not found',()=>{
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1,mockUser)).rejects.toThrow(NotFoundException);
        });
    });


    describe('createTasks',  () => {
        it("calls tasksRepository.createTasks and saves a new task", async () =>{
            tasksRepository.createTasks.mockResolvedValue("someValue");
            const mockTask:CreateTaskDTO = {title: "title",description: "description"};
            const result = await tasksService.createTasks(mockTask,mockUser);
            expect(tasksRepository.createTasks).toHaveBeenCalled();
            expect(tasksRepository.createTasks).toHaveBeenCalledWith(mockTask,mockUser);
            expect(result).toEqual("someValue");
        })
    });

    describe('deleteTaskById',  () => {
        it("calls tasksRepository.delete and deletes a  task", async () =>{
            tasksRepository.delete.mockResolvedValue({affected:1});
            expect(tasksRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(1,mockUser);
            expect(tasksRepository.delete).toHaveBeenCalledWith({id: 1,userId: mockUser.id});
        })
        it('throws an error if task can not be found', () => {
            tasksRepository.delete.mockResolvedValue({affected:0});
            expect(tasksService.deleteTaskById(1,mockUser)).rejects.toThrow(NotFoundException);
        });
    });




    describe('updateTaskById',  () => {
        it("update task status ", async () =>{
            const save =jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
               status: TaskStatus.OPEN,
               save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskById(1,TaskStatus.DONE,mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        })
        it('throws an error as task is not found',()=>{
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.updateTaskById(1,TaskStatus.DONE,mockUser)).rejects.toThrow(NotFoundException);
        });
    });



});
