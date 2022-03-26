import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(): Task[]{
        return this.tasksService.getAllTasks();
    }


    @Post()
    createTasks(@Body() body): Task{
        return this.tasksService.createTasks(body.title,body.description);
    }


}
