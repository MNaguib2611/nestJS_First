import { Body, Controller, Get, Param,Query, Post, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(
        @Query(ValidationPipe)taskFilter :GetTaskFilterDTO,
        @GetUser() user: User,
        ):Promise<Task[]>{
        return this.tasksService.getAllTasks(taskFilter,user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id',ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task>{
        return this.tasksService.getTaskById(id,user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTasks(
        @Body() createTaskDTO:CreateTaskDTO,
        @GetUser() user: User,
        ):  Promise<Task>{
        return this.tasksService.createTasks(createTaskDTO, user);
    }

    @Patch('/:id/status')
    updateTaskById(
        @Param('id',ParseIntPipe) id: number,
        @Body('status',TaskStatusValidationPipe)  status : TaskStatus,
        @GetUser() user: User,
        ): Promise<Task>{
        return this.tasksService.updateTaskById(id,status,user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id: number,
        @GetUser() user: User,
        ): Promise<void>{
        return this.tasksService.deleteTaskById(id,user);
    }


}
