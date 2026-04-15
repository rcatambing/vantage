
## Feed
The component Feed for this application similar to what is found in Facebook or LinkedIn.  A FeedItem is an entry in the feed has the following structure when displayed:
* Header
   - Left side
        a. Display an image of the source or owner of the post
        b. Name of the owner
        c. Descriptive title.
        d. Relative age of the post using common unit of time (seconds, minutes, hours, days)
   - Right side
        a. Button using "..." to provide additional actions.
        b. Indicate the tagged location of the post
        c. Status of the post i.e. New, For Verification, Verified, Immediate, Critical
* Content Area  
       a. Media container that should be able to render an image, video, or text in the main content 
       b. Caption  

* Action area 
      - This area is for holding buttons used for interaction, its buttons are as follows:

             a. Rate - which rates an entry in the field using the number of stars.
             b. Comment - allows users to comment on a post or entry in the feed.
             c. Action - context aware button, when pressed presents a set of available actions for the feed entry or post.
            d. Share - allows a to forward a post a user or group.


### Comment

Goal:
Create the components for comments used in the Feed component.

**Requirements**
Please create two primary components: CommentThread (container) and CommentItem (individual comment).

1. Functional Features:

Nested Threading: Support for at least one level of replies (replies to a comment).

Actions: Each comment should support "+1", "-1", "Reply," and an "Actions" menu (Edit/Delete) using Blueprint’s Popover or Menu.

State Management: Use optimistic UI patterns for "Liking" a comment.

Data Handling: Components should accept a comment object via props. Define a strict TypeScript interface IComment including: id, author (name, avatar, role), timestamp, content, likesCount, and an optional replies array.

2. UI/UX Specifications (Blueprint UI):

Layout: Use a left-aligned layout with a small Icon or Avatar (use Blueprint's Icon with a Circle intent if no image is present).

Typography: Use the <Text> and <H6> components from Blueprint for hierarchy.

Input: Use a TextArea or ControlGroup for the "Add Comment" field at the bottom of the thread.

Icons: Use @blueprintjs/icons (e.g., thumbs-up, chat, more, trash).

3. Technical Constraints:

React : Use the use hook for data fetching if applicable, or standard functional components with props.

TypeScript: Ensure 100% type safety. No any. Use Readonly for prop interfaces.

Styling: Follow Blueprint UI’s CSS classes (bp5-card, bp5-text-muted, etc.). Use a local .module.css file only if necessary for specific spacing not covered by Blueprint.

Deliverables
Comment.types.ts: TypeScript interfaces.

CommentItem.tsx: The stateless UI for a single comment.

CommentThread.tsx: The wrapper that handles the list and nesting logic.

CommentInput.tsx: The text entry field with a "Post" button.

## Action Button

Goal is to implement the Action Button. The Action Button when clicked offers the user a set of action
based on the context of the Feed Item.

**Requirements**

1. Functional Features:
     - The Action button when clicked offers the user a set of action based on the context of the Feed Item.  The actions is received as an array of objects from the web services.
     - When an action is clicked it displays a component that shows controls below are example:
          * Investigate Action Component - creates a investgation task that will be assigned to a person or group.
               - Assign - allows a user to type the name of a person or group to assign this task 
               - Watchers - allows a user to indicate name of person or group to be notified of status.
               - Status Update Schedule - checkbox and drop down, allows a user to check to enable and select status updates needed on a periodic basis.
               - Target Date - Date Control, allows the manager to set a target date to complete this task
               - Instruction - Textarea,  user inputs instructions to the assignee
          * Task Personnel - creates a personnel task that will be assigned to a person or group.
               - Assign - allows a user to type the name of a person or group to assign this task
               - Priority - drop down to select the priority of this task 
               - Instruction - Textarea,  user inputs instructions to the assignee
          * Watch - add this post and events related to this post to show up in the users personal feed.
               - Watch Priority - Indicate whether to feature updates related to this post at the top of the users feed.
               - Share -  allows a user to send notification to other users to watch a certain post.

## Share Button
Goal is to implement the Share  Button. The share button allows the user to share a post or entry in the feed.

**Requirements**
1. Functional Features
     - The Share Button when clicked shows a dialog that allows the user to type the name of a user or group to share the post.
     - After the OK button has been clicked, it shows notification to the user that the post has been shared.


## Rate Button
Goal is to implement the Rate Button. The Rate button allows the user to rate an entry in the feed with the number of stars.

**Requirements**
1. Functional Features 
     - The Rate Button when clicked shows a dialog that allows the user to select the number of stars to rate the entry.
     - After the Rate Button has been clicked, it toggles the star showing that it has been rated.

