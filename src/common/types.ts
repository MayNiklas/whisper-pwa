export class Transcipt {
  task_id!: string;
  transcript: string = '';
  source_language: string = '';
  task_type: string = '';
  status: string = 'new';
  time_uploaded: Date = new Date(0);
  processing_duration: number = 0;
  time_processing_finished: Date = new Date(0);
  target_model_size?: string;
  used_model_size: string = '';
  used_device: string = '';
}
