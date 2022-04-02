import { Body, Controller, Get, Param,Query, Post, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(@Query(ValidationPipe)taskFilter :GetTaskFilterDTO):Promise<Task[]>{
        return this.tasksService.getAllTasks(taskFilter);
    }

    @Get('/:id')
    getTaskById(@Param('id',ParseIntPipe) id: number): Promise<Task>{
        return this.tasksService.getTaskById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTasks(@Body() createTaskDTO:CreateTaskDTO):  Promise<Task>{
        return this.tasksService.createTasks(createTaskDTO);
    }

    @Patch('/:id/status')
    updateTaskById(
        @Param('id',ParseIntPipe) id: number,
        @Body('status',TaskStatusValidationPipe)  status : TaskStatus): Promise<Task>{
        return this.tasksService.updateTaskById(id,status);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: number): Promise<void>{
        return this.tasksService.deleteTaskById(id);
    }


}
