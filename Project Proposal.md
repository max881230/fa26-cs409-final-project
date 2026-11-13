CS 409 Final Project Proposal\
**Job Application Helper**

Team Members:

* Daniel Li [dsli4@illinois.edu](mailto:dsli4@illinois.edu)\
* Yun Han Lee [yhl7@illinois.edu](mailto:ylh7@illinois.edu)\
* Hsien-Hao Li [hl128@illinois.edu](mailto:hl128@illinois.edu)\
* Edward Zhang [edwardz7@illinois.edu](mailto:edwardz7@illinois.edu)\
* Haw Yuan [hawyuan2@illinois.edu](mailto:hawyuan2@illinois.edu)

## **1\. Problem Statement & Motivation**

The job application process is often time-consuming and overwhelming, especially for full-time students balancing academic responsibilities with career preparation. Applicants must search across multiple job boards, submit applications, monitor recruiting emails, and keep track of interviews and deadlines. Managing these activities across different platforms requires significant effort and increases the risk of missing important opportunities.

Our Job Application Helper aims to streamline this process through a centralized web application that helps users discover, organize, and monitor job opportunities. Our goal is to reduce the administrative burden of applying for jobs so users can focus more on preparing for interviews and pursuing career opportunities.

## **2\. User Problems We Aim to Solve**

Our application will address three primary challenges:

* **Fragmented application tracking:** Applicants often manage numerous applications across spreadsheets, emails, and job platforms. We aim to consolidate this information into one organized dashboard.\
* **Manual recruiting updates:** Users must repeatedly check their emails and update application statuses themselves. We aim to automate the detection of recruiting updates while allowing users to verify their accuracy.\
* **Difficulty managing deadlines:** Interviews, application deadlines, and follow-up tasks can become difficult to track. We aim to provide a visual timeline that clearly highlights upcoming events and priorities.

## **3\. Core Features & User Interactions**

Our proposed application will support the following interactions:

* **Application Management:** Users can create, edit, delete, and organize job applications, tracking their progress through stages such as Applied, Interviewing, Offered, and Rejected.\
* **Automated Email Integration:** With user authorization, the application will connect to Gmail to identify relevant recruiting emails, extract application updates or interview information, and associate them with existing applications. Users can confirm or correct suggested changes before they are saved.\
* **Calendar & Timeline:** Users can view upcoming interviews, application deadlines, and recruiting events through an interactive timeline or calendar.\
* **Job Discovery:** Users can search for job opportunities through external job-listing integrations or permitted data sources and save interesting positions to their application tracker.\
* **Reminders & Notifications:** Users can receive in-app reminders about approaching deadlines and upcoming interviews.\
* **User Accounts:** Users can register, log in securely, and maintain personalized application records.

If time permits, we may explore additional features such as mock interview preparation.

## **4\. Similar Existing Applications**

Existing platforms such as **Jobright** and **Simplify** provide tools for discovering job opportunities and streamlining parts of the application process. These services demonstrate the value of reducing repetitive tasks during a job search.

Our application will focus specifically on simplifying the ongoing management of applications after they have been submitted, particularly through email-based status updates and a centralized recruiting timeline.

## **5\. Our Differentiation**

The primary distinguishing feature of Job Application Helper is its emphasis on automated recruiting pipeline tracking.

Rather than requiring users to manually update every application, our system will analyze authorized recruiting emails and suggest corresponding status changes, interview events, or follow-up tasks. Users will retain control by reviewing and correcting these suggestions before they are finalized.

By integrating email-based updates with application tracking, timeline visualization, and reminders, we aim to provide a cohesive experience that minimizes administrative work throughout the recruiting process.

## **6\. Technical Approach & UX Considerations**

We tentatively plan to use React for the frontend, Node.js and Express for a RESTful API backend, and PostgreSQL for persistent data storage. User authentication and Gmail API integration will support personalized accounts and authorized email processing. The technology stack may change depending on implementation requirements.

User experience will be a primary focus, with an intuitive, responsive interface designed for desktop and mobile devices. We will conduct a heuristic evaluation of core user workflows and implement at least one round of revisions based on the identified usability issues.
