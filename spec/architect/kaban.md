# Kanban Board

## Requirements:
1. Tech Stack Requirements
    - Utilize existing packages and add other packages when needed.
    - This application will connect to the Kampanya-360 application 


2. Core Functional Requirements
    - Kanban Board & Campaign
        * A Kanban Board can be created and linked to a Campaign in Kampanya-360.
        * Multiple Boards can be configured associated with a Campaign to achieve its objectives.
        * When I mention Project it refers to a Kanban Board in this context.
        * Kanban Boards have owners and can be configured by the owner.
        * Kanban Boards have members which an view the board and update task tickets.

    - Customizable Columns:Users must be able to add, rename, delete, and reorder columns (e.g., To Do, In Progress, Review, Done).Each column should display a count of the tickets within it.
    
    - Task/Ticket Management:
        * Fields: Title, Description (Markdown support), Priority (Low, Medium, High), and Assignee.
        * User Assignment: A dropdown to select a team member to assign the task to.
        * Milestones & Progress:
            - Inside each ticket, users can add "Milestones" (a checklist of sub-tasks).
            - The ticket card must display a visual progress bar and a percentage.
            - Logic: The percentage is calculated as: $(\frac{\text{Completed Milestones}}{\text{Total Milestones}}) \times 100$. If there are no milestones, show 0% or "N/A".  Logic of calculating percentage should be placed in the web service and only be displayed here.

        * Drag-and-Drop: 
            * Smooth movement of cards between columns.
            * Persistence: Changes must be saved to the database immediately upon drop.
    - Comments
        * Allow users to comment on a Task ticket
        * Make sure that comments keep track of edits and is indicated in the comment when it was last edited.
        * Keep track of history of the comment and store it as some JSON blob so we don't complicate implementation.

3. UI/UX Specifications  
    - Layout: A collapsible left sidebar for project navigation and a top navigation bar for user profile/settings.
    - Color Palette: Use "Atlassian Blue" (#0052CC) for primary actions, with soft gray backgrounds (#F4F5F7) for the board area.
    - Cards: Clean cards with subtle shadows. Priority levels should be indicated by colored icons (e.g., Red up-arrow for High).
    - Empty States: Provide a clean UI when no tasks or columns exist.
    
4. Technical Constraints & Data Model
    - Entities: 
        * Project: id, name, key.
        * Column: id, title, orderIndex, projectId.
    - Task: id, title, description, priority, assigneeId, columnId, orderIndex.
    - Milestone: id, title, isCompleted, taskId.
    - Responsive Design: The board should scroll horizontally on smaller screens, while columns scroll vertically.

5. Implementation Instructions
    a. Implement the Board UI first using placeholder data to perfect the Atlassian styling.
    b. Add the Drag-and-Drop functionality.Implement the "Milestone Modal" where users can add/toggle sub-tasks, ensuring the progress bar on the main card updates reactively.
    c. Add the column customization settings.
    d. Add a demo page with static data.