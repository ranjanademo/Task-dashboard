export interface User {
    id: number;
    title: string;
    description: string;
    priority: 'Low'| 'Medium'| 'High';
    dueDate: Date;
    status: 'Pending' | 'Completed'
}
