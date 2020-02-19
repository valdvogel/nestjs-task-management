import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) { }
    // private tasks : Task[] = [];

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);

    }

    // getTasksWithFilters(filterDto: GetTasksFilterDto) : Task[] {
    //     const {status, search} = filterDto;

    //     let tasks = this.getAllTasks();

    //     if(status){
    //         tasks = tasks.filter(t => t.status === status);
    //     }

    //     if(search){
    //         tasks = tasks.filter(t => t.title.includes(search) || t.description.includes(search));
    //     }

    //     return tasks;

    // }
    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }
    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with id ${id} was not found!`);
        }
        return found;
    }

    async deleteTaskById(id: number): Promise<void> {
        // const found = await this.getTaskById(id);
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} was not found!`);
        }


    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;

        await task.save();
        return task;
    }
}
