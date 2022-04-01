import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common'
import { TaskStatus } from '../tasks.model';

export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is invalid status`);
            
        }
        return value;
    }


    private isStatusValid(status:any){
        const idx =  this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}