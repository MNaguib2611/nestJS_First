import { Body, Controller, Get, Param,Query, Post, Delete, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { Task,TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(@Query(ValidationPipe)taskFilter :GetTaskFilterDTO): Task[]{
        if (Object.keys(taskFilter).length) {
            return this.tasksService.getTasksWithFilters(taskFilter); 
        }
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task{
        return this.tasksService.getTaskById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTasks(@Body() createTaskDTO:CreateTaskDTO): Task{
        return this.tasksService.createTasks(createTaskDTO);
    }

    @Patch('/:id/status')
    updateTaskById(
        @Param('id') id: string,
        @Body('status',TaskStatusValidationPipe)  status : TaskStatus): Task{
        return this.tasksService.updateTaskById(id,status);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void{
        return this.tasksService.deleteTaskById(id);
    }


}
