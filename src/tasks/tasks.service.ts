import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger();
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) { }

  async getTasks(filterDto: GetTasksFilterDto,user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);

  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({where :{id, userId: user.id} });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} was not found!`);
    }
    return found;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    // const found = await this.getTaskById(id);
    const result = await this.taskRepository.delete({id, userId: user.id});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} was not found!`);
    }


  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task> {
    try {
      return this.taskRepository.createTask(createTaskDto,user);
    } catch (e) {
      console.log(e);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus,user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();
    return task;
  }
}
