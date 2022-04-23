import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { NotFoundError } from 'rxjs';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ){}




    getAllTasks(
        taskFilter :GetTaskFilterDTO,
        user: User):  Promise<Task[]>{
        return this.taskRepository.getAllTasks(taskFilter,user);
    }



    async getTaskById(
        id : number,
        user: User
        ): Promise<Task>{
       const found = await this.taskRepository.findOne({where: {id, userId: user.id}});
       if (!found) {
           throw new NotFoundException(`Task with id ${id} not found`);
       }
       return found;
    }




    async createTasks(createTaskDTO :CreateTaskDTO ,user: User): Promise<Task>{
        return await this.taskRepository.createTasks(createTaskDTO, user);
    }



    async updateTaskById(
        id : number,
        status : TaskStatus,
        user: User
        ):Promise<Task>{
        const task = await this.getTaskById(id,user);
        task.status=status;
        await task.save();
        return  task;
    }


    async deleteTaskById(
        id : number,
        user: User
        ) : Promise<void>{
        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }
    
}
