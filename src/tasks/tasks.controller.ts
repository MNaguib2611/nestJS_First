import { Body, Controller, Get, Param,Query, Post, Delete, Patch } from '@nestjs/common';
import { Task,TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(@Query()taskFilter :GetTaskFilterDTO): Task[]{
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
    createTasks(@Body() createTaskDTO:CreateTaskDTO): Task{
        return this.tasksService.createTasks(createTaskDTO);
    }

    @Patch('/:id/status')
    updateTaskById(@Param('id') id: string,@Body('status')  status : TaskStatus): Task{
        return this.tasksService.updateTaskById(id,status);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void{
        return this.tasksService.deleteTaskById(id);
    }


}
