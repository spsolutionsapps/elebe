import { IsString, IsNumber, IsIn } from 'class-validator';

export class UpdateTaskOrderDto {
  @IsString()
  taskId: string;

  @IsIn(['todo', 'in_progress', 'done'])
  newStatus: string;

  @IsNumber()
  newOrder: number;
}
