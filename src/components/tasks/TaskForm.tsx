import React, { useState } from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

interface TaskFormProps {
  onClose: () => void;
  taskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskId }) => {
  const { tasks, addTask, updateTask } = useApp();
  
  // Find existing task if editing
  const existingTask = taskId ? tasks.find(t => t.id === taskId) : null;
  
  // Form state
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(existingTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');
  const [useTimeBlock, setUseTimeBlock] = useState(Boolean(existingTask?.timeBlock));
  const [timeBlockStart, setTimeBlockStart] = useState(existingTask?.timeBlock?.start || '');
  const [timeBlockEnd, setTimeBlockEnd] = useState(existingTask?.timeBlock?.end || '');
  const [tags, setTags] = useState<string[]>(existingTask?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      timeBlock: useTimeBlock ? {
        start: timeBlockStart,
        end: timeBlockEnd,
      } : undefined,
      tags: tags.length > 0 ? tags : undefined,
    };
    
    if (existingTask) {
      updateTask(existingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };
  
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {existingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title <span className="text-error-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details about this task"
              rows={3}
              className="textarea w-full"
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority <span className="text-error-500">*</span>
            </label>
            <select
              id="priority"
              value={priority}
              onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="select w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <input
                id="useTimeBlock"
                type="checkbox"
                checked={useTimeBlock}
                onChange={e => setUseTimeBlock(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="useTimeBlock" className="ml-2 text-sm font-medium">
                Add Time Block
              </label>
            </div>
            
            {useTimeBlock && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <label htmlFor="timeBlockStart" className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="timeBlockStart"
                      type="time"
                      value={timeBlockStart}
                      onChange={e => setTimeBlockStart(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="timeBlockEnd" className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="timeBlockEnd"
                      type="time"
                      value={timeBlockEnd}
                      onChange={e => setTimeBlockEnd(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                  className="input pl-10 w-full"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="ml-2 btn btn-outline"
              >
                Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/40"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {existingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;