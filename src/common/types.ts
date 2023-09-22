export class Transcipt {
  task_id!: string;
  transcript: string = '';
  source_language: string = '';
  task_type: string = '';
  status: string = 'new';
  time_uploaded: Date | undefined;
  processing_duration: number = 0;
  time_processing_finished: Date | undefined;
  target_model_size?: string;
  used_model_size: string = '';
  used_device: string = '';
}
