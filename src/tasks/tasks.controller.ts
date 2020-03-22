import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';
import {Logger} from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController');
    constructor(private taskService: TasksService){}
    @Get()
    getTasks(
      @Query(ValidationPipe) filterDto: GetTasksFilterDto,
      @GetUser() user: User
    ): Promise<Task[]> {
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number,@GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number,@GetUser() user: User): Promise<void> {
        return this.taskService.deleteTaskById(id, user);
    }
    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', new TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User) : Promise<Task>{
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
