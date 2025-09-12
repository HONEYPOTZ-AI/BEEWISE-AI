
import { defaultTaskTemplates } from '@/utils/defaultTaskTemplates';

const TASK_TEMPLATES_TABLE_ID = 37328;
const BUSINESS_STAGES_TABLE_ID = 37248;

export class TaskTemplateService {
  static async initializeDefaultTemplates(): Promise<boolean> {
    try {
      // First, get all business stages to map stage names to IDs
      const stagesResult = await window.ezsite.apis.tablePage(BUSINESS_STAGES_TABLE_ID, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "stage_order",
        IsAsc: true
      });

      if (stagesResult.error) {
        throw new Error(`Failed to fetch business stages: ${stagesResult.error}`);
      }

      const stages = stagesResult.data?.List || [];

      // Check if templates already exist
      const templatesResult = await window.ezsite.apis.tablePage(TASK_TEMPLATES_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: "id",
        IsAsc: true
      });

      if (templatesResult.error) {
        throw new Error(`Failed to check existing templates: ${templatesResult.error}`);
      }

      // If templates already exist, don't initialize again
      if (templatesResult.data?.List && templatesResult.data.List.length > 0) {
        console.log('Task templates already exist, skipping initialization');
        return true;
      }

      // Create stage name to ID mapping
      const stageNameToId: {[key: string]: number;} = {};
      stages.forEach((stage: any) => {
        stageNameToId[stage.name] = stage.id;
      });

      // Insert default templates
      const templatePromises = defaultTaskTemplates.map(async (template) => {
        const stageId = stageNameToId[template.business_stage_name];
        if (!stageId) {
          console.warn(`Stage "${template.business_stage_name}" not found, skipping template "${template.name}"`);
          return false;
        }

        const templateData = {
          name: template.name,
          description: template.description,
          business_stage_id: stageId,
          task_type: template.task_type,
          priority: template.priority,
          complexity_score: template.complexity_score,
          estimated_duration: template.estimated_duration,
          template_data: template.template_data,
          required_agent_types: template.required_agent_types,
          success_criteria: template.success_criteria,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const result = await window.ezsite.apis.tableCreate(TASK_TEMPLATES_TABLE_ID, templateData);
        if (result.error) {
          console.error(`Failed to create template "${template.name}":`, result.error);
          return false;
        }
        return true;
      });

      const results = await Promise.all(templatePromises);
      const successCount = results.filter(Boolean).length;

      console.log(`Successfully initialized ${successCount} task templates`);
      return true;

    } catch (error) {
      console.error('Error initializing task templates:', error);
      return false;
    }
  }

  static async getTemplatesByStage(stageId: number) {
    try {
      const result = await window.ezsite.apis.tablePage(TASK_TEMPLATES_TABLE_ID, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "name",
        IsAsc: true,
        Filters: [
        {
          name: "business_stage_id",
          op: "Equal",
          value: stageId
        },
        {
          name: "is_active",
          op: "Equal",
          value: true
        }]

      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data?.List || [];
    } catch (error) {
      console.error('Error fetching templates by stage:', error);
      return [];
    }
  }

  static async createCustomTemplate(templateData: any) {
    try {
      const data = {
        ...templateData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await window.ezsite.apis.tableCreate(TASK_TEMPLATES_TABLE_ID, data);
      if (result.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (error) {
      console.error('Error creating custom template:', error);
      return false;
    }
  }

  static async updateTemplate(templateId: number, templateData: any) {
    try {
      const data = {
        ID: templateId,
        ...templateData,
        updated_at: new Date().toISOString()
      };

      const result = await window.ezsite.apis.tableUpdate(TASK_TEMPLATES_TABLE_ID, data);
      if (result.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  }

  static async deleteTemplate(templateId: number) {
    try {
      const result = await window.ezsite.apis.tableDelete(TASK_TEMPLATES_TABLE_ID, { ID: templateId });
      if (result.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }
}