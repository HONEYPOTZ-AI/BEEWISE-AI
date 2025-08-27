import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Globe, MapPin, DollarSign, Users, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface BusinessFormData {
  name: string;
  description: string;
  industry: string;
  business_type: string;
  website_url: string;
  contact_email: string;
  phone_number: string;
  address: string;
  revenue_target: number;
  current_revenue: number;
  employee_count: number;
}

interface BusinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessFormData) => Promise<void>;
  initialData?: Partial<BusinessFormData>;
  isEditing?: boolean;
  loading?: boolean;
}

const INDUSTRY_OPTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
  'Real Estate', 'Entertainment', 'Food & Beverage', 'Transportation', 'Energy',
  'Construction', 'Agriculture', 'Legal Services', 'Consulting', 'Other'
];

const BUSINESS_TYPE_OPTIONS = [
  'Startup', 'Small Business (SME)', 'Medium Enterprise', 'Large Enterprise',
  'Non-Profit', 'Freelance', 'Consulting', 'E-commerce', 'SaaS', 'Other'
];

const BusinessForm: React.FC<BusinessFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  loading = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BusinessFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      industry: initialData?.industry || '',
      business_type: initialData?.business_type || '',
      website_url: initialData?.website_url || '',
      contact_email: initialData?.contact_email || '',
      phone_number: initialData?.phone_number || '',
      address: initialData?.address || '',
      revenue_target: initialData?.revenue_target || 0,
      current_revenue: initialData?.current_revenue || 0,
      employee_count: initialData?.employee_count || 1,
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {isEditing ? 'Edit Business' : 'Create New Business'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name *
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Business name is required' })}
                placeholder="Enter business name"
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your business..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={watchedValues.industry} 
                onValueChange={(value) => setValue('industry', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="business_type">Business Type</Label>
              <Select 
                value={watchedValues.business_type} 
                onValueChange={(value) => setValue('business_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact Information */}
            <div>
              <Label htmlFor="contact_email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Email
              </Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="contact@business.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone_number" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone_number"
                {...register('phone_number')}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website URL
              </Label>
              <Input
                id="website_url"
                type="url"
                {...register('website_url')}
                placeholder="https://business.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Business address"
                className="mt-1"
              />
            </div>

            {/* Financial Information */}
            <div>
              <Label htmlFor="revenue_target" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Annual Revenue Target ($)
              </Label>
              <Input
                id="revenue_target"
                type="number"
                {...register('revenue_target', { min: 0 })}
                placeholder="1000000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="current_revenue" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Current Revenue ($)
              </Label>
              <Input
                id="current_revenue"
                type="number"
                {...register('current_revenue', { min: 0 })}
                placeholder="250000"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="employee_count" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employee Count
              </Label>
              <Input
                id="employee_count"
                type="number"
                {...register('employee_count', { min: 1 })}
                placeholder="10"
                className="mt-1"
              />
            </div>
          </div>

          {/* Preview */}
          {watchedValues.name && (
            <Card className="business-card">
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{watchedValues.name}</h3>
                    <div className="flex gap-2">
                      {watchedValues.industry && (
                        <Badge variant="secondary" className="text-xs">
                          {watchedValues.industry}
                        </Badge>
                      )}
                      {watchedValues.business_type && (
                        <Badge variant="outline" className="text-xs">
                          {watchedValues.business_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {watchedValues.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {watchedValues.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    {watchedValues.employee_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {watchedValues.employee_count} employees
                      </div>
                    )}
                    {watchedValues.revenue_target > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${(watchedValues.revenue_target / 100).toLocaleString()} target
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loading}
              className="beewise-gradient"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Business' : 'Create Business'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessForm;
