import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTaskFilterDTO } from "./dto/get-task.filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTasks(createTaskDTO :CreateTaskDTO ): Promise<Task>{
        const {title, description} = createTaskDTO;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
     }

    async getAllTasks(taskFilter:GetTaskFilterDTO): Promise<Task[]> {
        const {status, search} = taskFilter;
        const query = this.createQueryBuilder('task');

            if (status) {
                query.andWhere('task.status = :status',{status});
            }

            if (search) {
                query.andWhere('task.title LIKE :search OR task.description LIKE :search',{search: `%${search}%`});
            }


        return await query.getMany();
    }

}