-- Migration: Add performance indexes for frequently queried fields
-- Date: 2025-01-03
-- Description: Add indexes to improve query performance for common operations

-- Indexes for Slide model
CREATE INDEX IF NOT EXISTS "Slide_isActive_order_idx" ON "Slide"("isActive", "order");
CREATE INDEX IF NOT EXISTS "Slide_order_idx" ON "Slide"("order");
 
-- Indexes for Product model
CREATE INDEX IF NOT EXISTS "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX IF NOT EXISTS "Product_isFeatured_featuredOrder_idx" ON "Product"("isFeatured", "featuredOrder");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt" DESC);

-- Indexes for Inquiry model
CREATE INDEX IF NOT EXISTS "Inquiry_status_idx" ON "Inquiry"("status");
CREATE INDEX IF NOT EXISTS "Inquiry_priority_idx" ON "Inquiry"("priority");
CREATE INDEX IF NOT EXISTS "Inquiry_createdAt_idx" ON "Inquiry"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Inquiry_assignedTo_idx" ON "Inquiry"("assignedTo");
CREATE INDEX IF NOT EXISTS "Inquiry_nextFollowUpDate_idx" ON "Inquiry"("nextFollowUpDate");

-- Indexes for Task model
CREATE INDEX IF NOT EXISTS "Task_status_priority_idx" ON "Task"("status", "priority");
CREATE INDEX IF NOT EXISTS "Task_assignedTo_idx" ON "Task"("assignedTo");
CREATE INDEX IF NOT EXISTS "Task_dueDate_idx" ON "Task"("dueDate");
CREATE INDEX IF NOT EXISTS "Task_order_idx" ON "Task"("order");

-- Indexes for Reminder model
CREATE INDEX IF NOT EXISTS "Reminder_date_isCompleted_idx" ON "Reminder"("date", "isCompleted");
CREATE INDEX IF NOT EXISTS "Reminder_type_idx" ON "Reminder"("type");
CREATE INDEX IF NOT EXISTS "Reminder_priority_idx" ON "Reminder"("priority");

-- Indexes for Client model
CREATE INDEX IF NOT EXISTS "Client_isActive_idx" ON "Client"("isActive");
CREATE INDEX IF NOT EXISTS "Client_email_idx" ON "Client"("email");

-- Indexes for Brand model
CREATE INDEX IF NOT EXISTS "Brand_isActive_order_idx" ON "Brand"("isActive", "order");

-- Indexes for Cart model
CREATE INDEX IF NOT EXISTS "Cart_sessionId_idx" ON "Cart"("sessionId");
CREATE INDEX IF NOT EXISTS "Cart_createdAt_idx" ON "Cart"("createdAt" DESC);

-- Indexes for CartItem model
CREATE INDEX IF NOT EXISTS "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE INDEX IF NOT EXISTS "CartItem_productId_idx" ON "CartItem"("productId");
CREATE INDEX IF NOT EXISTS "CartItem_addedAt_idx" ON "CartItem"("addedAt" DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "Product_isActive_category_createdAt_idx" ON "Product"("isActive", "category", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Inquiry_status_priority_createdAt_idx" ON "Inquiry"("status", "priority", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Task_status_assignedTo_dueDate_idx" ON "Task"("status", "assignedTo", "dueDate");
