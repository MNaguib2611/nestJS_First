import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(): Task[]{
        return this.tasksService.getAllTasks();
    }


    @Post()
    createTasks(@Body() createTaskDTO:CreateTaskDTO): Task{
        return this.tasksService.createTasks(createTaskDTO);
    }


}
