import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { NotFoundError } from 'rxjs';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ){}




    getAllTasks(taskFilter :GetTaskFilterDTO):  Promise<Task[]>{
        return this.taskRepository.getAllTasks(taskFilter);
    }



    async getTaskById(id : number): Promise<Task>{
       const found = await this.taskRepository.findOne(id);
       if (!found) {
           throw new NotFoundException(`Task with id ${id} not found`);
       }
       return found;
    }




    async createTasks(createTaskDTO :CreateTaskDTO ): Promise<Task>{
        return await this.taskRepository.createTasks(createTaskDTO);
    }



    async updateTaskById(id : number, status : TaskStatus):Promise<Task>{
        const task = await this.getTaskById(id);
        task.status=status;
        await task.save();
        return  task;
    }


    async deleteTaskById(id : number) : Promise<void>{
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }
    
}
