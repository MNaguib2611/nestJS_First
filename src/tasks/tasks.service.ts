import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { NotFoundError } from 'rxjs';


@Injectable()
export class TasksService {
    private tasks: Task[] = [];


    getAllTasks(): Task[]{
        return this.tasks;
    }


    getTasksWithFilters(taskFilter: GetTaskFilterDTO): Task[]{
        const {status, search} = taskFilter;
        let tasks = this.getAllTasks();

        if (status) {
            tasks=tasks.filter(task=>task.status===status);
        }

        if (search) {
            tasks=tasks.filter((task)=>{
                return task.title.includes(search) || task.description.includes(search)
            });
        }


        return tasks;
    }
    



    getTaskById(id : string): Task{
       const found = this.tasks.find(task=>task.id === id);
       if (!found) {
           throw new NotFoundException(`Task with id ${id} not found`);
       }
       return found;
    }



    createTasks(createTaskDTO :CreateTaskDTO ): Task{
       const {title, description} = createTaskDTO;

        const task: Task = {
            id : uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task);
        return task;
    }


    updateTaskById(id : string, status : TaskStatus):Task{
        const task = this.getTaskById(id);
        task.status=status;
        return  task;
    }


    deleteTaskById(id : string) : void{
        const found = this.getTaskById(id);
        this.tasks =  this.tasks.filter((task)=> {return task.id !== found.id});
    }


    
}
