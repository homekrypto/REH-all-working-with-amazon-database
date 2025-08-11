'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  Eye, 
  Code, 
  Save, 
  Copy,
  Settings,
  FormInput,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  CheckSquare
} from "lucide-react";

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface LeadForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  settings: {
    redirectUrl?: string;
    emailNotifications: boolean;
    autoResponse: boolean;
    autoResponseMessage?: string;
  };
  createdAt: string;
  submissions: number;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: FormInput },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'textarea', label: 'Text Area', icon: FormInput },
  { value: 'select', label: 'Dropdown', icon: FormInput },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare }
];

const mockForms: LeadForm[] = [
  {
    id: '1',
    name: 'Property Interest Form',
    description: 'Capture leads interested in luxury properties',
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true },
      { id: '2', type: 'email', label: 'Email Address', required: true },
      { id: '3', type: 'phone', label: 'Phone Number', required: false },
      { id: '4', type: 'select', label: 'Property Type', required: true, options: ['Apartment', 'House', 'Condo', 'Villa'] },
      { id: '5', type: 'textarea', label: 'Additional Comments', required: false }
    ],
    settings: {
      emailNotifications: true,
      autoResponse: true,
      autoResponseMessage: 'Thank you for your interest! We will contact you within 24 hours.'
    },
    createdAt: '2024-01-15',
    submissions: 47
  }
];

export function LeadFormBuilder() {
  const [forms, setForms] = useState<LeadForm[]>(mockForms);
  const [selectedForm, setSelectedForm] = useState<LeadForm | null>(forms[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({});
  const [showFieldModal, setShowFieldModal] = useState(false);

  const addField = () => {
    if (!selectedForm || !newField.type || !newField.label) return;
    
    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.options || []
    };

    const updatedForm = {
      ...selectedForm,
      fields: [...selectedForm.fields, field]
    };

    setSelectedForm(updatedForm);
    setForms(forms.map(f => f.id === selectedForm.id ? updatedForm : f));
    setNewField({});
    setShowFieldModal(false);
  };

  const removeField = (fieldId: string) => {
    if (!selectedForm) return;
    
    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.filter(f => f.id !== fieldId)
    };

    setSelectedForm(updatedForm);
    setForms(forms.map(f => f.id === selectedForm.id ? updatedForm : f));
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    if (!fieldType) return FormInput;
    return fieldType.icon;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Forms List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lead Forms</CardTitle>
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedForm?.id === form.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedForm(form)}
            >
              <h4 className="font-medium text-gray-900 mb-1">{form.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{form.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{form.fields.length} fields</span>
                <span>{form.submissions} submissions</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form Builder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedForm?.name || 'Select a form'}</CardTitle>
              <CardDescription>{selectedForm?.description}</CardDescription>
            </div>
            {selectedForm && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-1" />
                  Embed Code
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {selectedForm ? (
          <CardContent className="space-y-6">
            {/* Fields List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Form Fields</h4>
                <Button size="sm" onClick={() => setShowFieldModal(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {selectedForm.fields.map((field) => {
                  const Icon = getFieldIcon(field.type);
                  return (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{field.label}</p>
                          <p className="text-xs text-gray-500 capitalize">{field.type}</p>
                        </div>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Settings */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Form Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Redirect URL (optional)</Label>
                  <Input placeholder="https://yoursite.com/thank-you" />
                </div>
                <div className="space-y-2">
                  <Label>Form Title</Label>
                  <Input value={selectedForm.name} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email when form is submitted</p>
                </div>
                <Switch checked={selectedForm.settings.emailNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Response</Label>
                  <p className="text-sm text-gray-500">Send automatic reply to submitters</p>
                </div>
                <Switch checked={selectedForm.settings.autoResponse} />
              </div>
              
              {selectedForm.settings.autoResponse && (
                <div className="space-y-2">
                  <Label>Auto Response Message</Label>
                  <Textarea 
                    value={selectedForm.settings.autoResponseMessage}
                    placeholder="Thank you for your submission..."
                  />
                </div>
              )}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="text-center py-12">
              <FormInput className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a form to start editing</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Field</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select onValueChange={(value) => setNewField({...newField, type: value as FormField['type']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Field Label</Label>
                <Input
                  value={newField.label || ''}
                  onChange={(e) => setNewField({...newField, label: e.target.value})}
                  placeholder="Enter field label"
                />
              </div>

              <div className="space-y-2">
                <Label>Placeholder (optional)</Label>
                <Input
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField({...newField, placeholder: e.target.value})}
                  placeholder="Enter placeholder text"
                />
              </div>

              {newField.type === 'select' && (
                <div className="space-y-2">
                  <Label>Options (one per line)</Label>
                  <Textarea
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    onChange={(e) => setNewField({
                      ...newField, 
                      options: e.target.value.split('\n').filter(Boolean)
                    })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Required Field</Label>
                <Switch
                  checked={newField.required || false}
                  onCheckedChange={(checked) => setNewField({...newField, required: checked})}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addField} className="flex-1">
                  Add Field
                </Button>
                <Button variant="outline" onClick={() => setShowFieldModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
