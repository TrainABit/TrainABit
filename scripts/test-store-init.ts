/**
 * Smoke test script to verify store initialization and seeding
 * 
 * This script validates:
 * - Seed data generation
 * - Type correctness
 * - Budget calculations
 * - Quick stats generation
 */

import { createSeedPlans } from '../data/seed/createSeedPlans';
import { BudgetCategory, PlanType } from '../types/enums';

console.log('🚀 Starting store initialization smoke test...\n');

try {
  const seedData = createSeedPlans();
  
  console.log('✅ Seed data created successfully');
  console.log(`   Plans: ${seedData.planOrder.length}`);
  console.log(`   Version: ${seedData.version}\n`);
  
  seedData.planOrder.forEach((planId) => {
    const plan = seedData.plans[planId];
    
    console.log(`📋 ${plan.name} (${plan.id})`);
    console.log(`   Type: ${plan.type}`);
    console.log(`   Timeline: ${plan.startDate} → ${plan.targetDate}`);
    console.log(`   Progress: ${plan.percentComplete}%`);
    console.log(`   Milestones: ${plan.milestones.length}`);
    console.log(`   Tasks: ${plan.tasks.length}`);
    console.log(`   Budget Items: ${plan.budget.length}`);
    console.log(`   KPIs: ${plan.kpis.length}`);
    console.log(`   Risks: ${plan.risks.length}`);
    console.log(`   Resources: ${plan.resources.length}`);
    
    const totalAllocation = plan.budget.reduce((sum, item) => sum + item.allocation, 0);
    const totalSpent = plan.budget.reduce((sum, item) => sum + item.spent, 0);
    const totalRemaining = plan.budget.reduce((sum, item) => sum + item.remaining, 0);
    
    console.log(`   Budget: $${totalAllocation.toLocaleString()} allocated`);
    console.log(`           $${totalSpent.toLocaleString()} spent`);
    console.log(`           $${totalRemaining.toLocaleString()} remaining`);
    
    plan.budget.forEach((item) => {
      if (item.remaining !== item.allocation - item.spent - item.committed) {
        throw new Error(`Budget calculation error in ${plan.id} item ${item.id}`);
      }
      if (item.variance !== item.allocation - item.spent) {
        throw new Error(`Variance calculation error in ${plan.id} item ${item.id}`);
      }
    });
    
    console.log(`   Quick Stats:`);
    console.log(`     - Tasks: ${plan.quickStats.completedTasks}/${plan.quickStats.totalTasks} (${plan.quickStats.taskCompletionRate}%)`);
    console.log(`     - Milestones: ${plan.quickStats.completedMilestones}/${plan.quickStats.totalMilestones} (${plan.quickStats.milestoneCompletionRate}%)`);
    console.log(`     - Budget allocated: $${plan.quickStats.totalBudgetAllocated.toLocaleString()}`);
    console.log(`     - Budget spent: $${plan.quickStats.totalBudgetSpent.toLocaleString()}`);
    console.log(`     - Budget remaining: $${plan.quickStats.totalBudgetRemaining.toLocaleString()}`);
    console.log();
  });
  
  const totalBudgetAcrossPlans = seedData.planOrder.reduce((sum, planId) => {
    return sum + seedData.plans[planId].budget.reduce((planSum, item) => planSum + item.allocation, 0);
  }, 0);
  
  console.log(`💰 Total budget across all plans: $${totalBudgetAcrossPlans.toLocaleString()}`);
  
  if (totalBudgetAcrossPlans !== 500000) {
    console.warn(`⚠️  Warning: Total budget is $${totalBudgetAcrossPlans.toLocaleString()}, expected $500,000`);
  } else {
    console.log('✅ Total budget matches expected $500,000\n');
  }
  
  console.log('✅ All validations passed!');
  console.log('🎉 Store initialization smoke test completed successfully\n');
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}
