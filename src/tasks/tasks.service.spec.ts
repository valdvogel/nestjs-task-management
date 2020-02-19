import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('task service', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTask', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('sameValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'some query' };
            const result = await tasksService.getTasks(filters);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('sameValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesfully retrieve and return a task ', async () => {
            const task = { title: 't', description: 'd' };
            taskRepository.findOne.mockResolvedValue(task);

            expect(taskRepository.findOne).not.toHaveBeenCalled();
            const result = await tasksService.getTaskById(1);
            expect(taskRepository.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(task);

        });
        it('throw an error as tasks is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('create a new task', async () => {
            const task: CreateTaskDto = { title: 't', description: 'd' };
            taskRepository.createTask.mockResolvedValue(task);

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const result = await tasksService.createTask(task);
            expect(taskRepository.createTask).toHaveBeenCalledWith(task);
            expect(result).toEqual(task);
        });

    });
    describe('deleteTask', () => {
        it('calls this.taskRepository.delete() by id', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            const result = await tasksService.deleteTaskById(1);
            expect(taskRepository.delete).toHaveBeenCalledWith(1);
        });
        it('throw error when id is not found', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            expect(tasksService.deleteTaskById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTask', () => {
        it('calls taskService.updateTaskStatus() and change task status', async () =>{
            const save = jest.fn().mockRejectedValue(true);
            
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });
            
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1,TaskStatus.DONE);
            // expect(tasksService.getTaskById).toHaveBeenCalled();
            // expect(save).toHaveBeenCalled();
            // expect(result).toEqual({status: TaskStatus.DONE});

        }); 

    });
});