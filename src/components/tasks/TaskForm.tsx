import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
      title: title.trim(),
      description: description.trim() || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl animate-slide-up overflow-hidden">

        {/* Modern Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {existingTask ? 'Refine Task Details' : 'Create New Focus Task'}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Plan and optimize your task workloads effortlessly</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="E.g., Finalize presentation slides"
              className="input w-full focus:ring-teal-500"
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Objective & Context
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What are the core deliverables of this task?"
              rows={3}
              className="textarea w-full"
            />
          </div>

          {/* Symmetrical split: Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Priority Select */}
            <div>
              <label htmlFor="priority" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Task Priority <span className="text-rose-500">*</span>
              </label>
              <select
                id="priority"
                value={priority}
                onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="select w-full"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label htmlFor="dueDate" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={15} />
                </div>
                <input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="input pl-9 w-full"
                />
              </div>
            </div>

          </div>
          
          {/* Time Block Accordion */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <input
                  id="useTimeBlock"
                  type="checkbox"
                  checked={useTimeBlock}
                  onChange={e => setUseTimeBlock(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="useTimeBlock" className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                  Schedule specific time block
                </label>
              </div>
              <Clock size={15} className="text-slate-400" />
            </div>
            
            {useTimeBlock && (
              <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-in">
                <div>
                  <label htmlFor="timeBlockStart" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    id="timeBlockStart"
                    type="time"
                    value={timeBlockStart}
                    onChange={e => setTimeBlockStart(e.target.value)}
                    className="input w-full py-1 text-xs"
                  />
                </div>
                
                <div>
                  <label htmlFor="timeBlockEnd" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    id="timeBlockEnd"
                    type="time"
                    value={timeBlockEnd}
                    onChange={e => setTimeBlockEnd(e.target.value)}
                    className="input w-full py-1 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Tags Section */}
          <div>
            <label htmlFor="tags" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Task Labels / Tags
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag size={14} />
                </div>
                <input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="E.g., Presentation, Design"
                  className="input pl-9 w-full"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="btn btn-outline py-2 px-3 text-xs flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-rose-500 rounded-full transition-colors ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Actions Footer */}
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800/80 flex justify-end gap-3 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs flex items-center gap-1"
            >
              <Check size={14} />
              {existingTask ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;