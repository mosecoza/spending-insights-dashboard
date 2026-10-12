# API CONTRACT (copy from CustomerSpendingInsightsEndpoints.md - DO NOT invent endpoints)

Base: /api/customers/{customerId}

1. GET /profile -> {customerId,name,email,joinDate,accountType,totalSpent,currency:ZAR}
2. GET /spending/summary?period=7d|30d|90d|1y -> {period,totalSpent,transactionCount,averageTransaction,topCategory,comparedToPrevious:{spentChange,transactionChange}}
3. GET /spending/categories?period&startDate&endDate -> {dateRange,totalAmount,categories[]:{name,amount,percentage,transactionCount,color,icon}}
4. GET /spending/trends?months (def 12 max 24) -> {trends[]:{month,totalSpent,transactionCount,averageTransaction}}
5. GET /transactions?limit(def20 max100)&offset&category&startDate&endDate&sortBy=date_desc|date_asc|amount_desc|amount_asc -> {transactions[]:{id,date,merchant,category,amount,description,paymentMethod,icon,categoryColor},pagination:{total,limit,offset,hasMore}}
6. GET /goals -> {goals[]:{id,category,monthlyBudget,currentSpent,percentageUsed,daysRemaining,status:on_track|warning|over_budget}}
7. GET /filters -> {categories[]:{name,color,icon},dateRangePresets[]:{label,value}}
