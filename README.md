# LinkHub
	
![https://drive.google.com/file/d/1SmmI8p24733B_RB49ZlM6tGPsyG7Y7pc/view?usp=sharing](#)

LinkHub is a modern, dark-themed web application that allows users to create and manage personalized link collections. Think of it as a simplified, personalized link-in-bio tool where users can organize and share their important links in a beautiful, easy-to-access interface.

## 🌟 Features

- **Personal Link Collections**: Create your own LinkHub with a unique username
- **Dark Theme**: Eye-friendly dark mode interface with modern design
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Search**: Quickly find links within your collection
- **Secure Authentication**: Powered by Clerk for reliable user management
- **Admin Controls**: Edit and manage your links with an intuitive interface
- **Public Sharing**: Share your LinkHub with anyone using your unique URL

## 🚀 Live Demo

[https://linkhub.vercel.app/](#) 

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Authentication**: Clerk
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📷 Screenshots

### Home Page

![https://drive.google.com/file/d/1bYEnkKURa7fCkBfLxcYu-If6VAmBo5G-/view?usp=sharing](#)

Landing page with quick access to create or view LinkHubs.

### Create LinkHub

![https://drive.google.com/file/d/1Z3z8d03ShxyLeKGgAToOW_LPruqVMYpf/view?usp=sharing](#)

Simple interface to create your own LinkHub.

### Profile View(Admin)

![https://drive.google.com/file/d/1TBEOmtwAYzIURY64kjQGn0laHWYqOjyP/view?usp=sharing](#)

Individual LinkHub profile with search and link management.(with edit access)

### Profile View(Not_Admin)

![https://drive.google.com/file/d/1f6nwhq16NRP9_DF6OKsjI-dfwjxeI9WP/view?usp=sharing](#)

Individual LinkHub profile with search and link management.(without edit access)


## 🏗️ Project Structure
src/
├── components/
   ├── Home.js(Landing page component)
   ├── Profile.js(LinkHub profile view)
   ├── CreateLinkHub.js(New LinkHub creation)
   ├── Navbar.js(Navigation component)
   └── SearchBar.js (Link search component)
├── App.js (Main application component)
├── supabaseClient.js(Supabase configuration)
└── index.js(Application entry point)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/linkhub.git
   cd linkhub
2. Install dependencies
   ```bash   
   npm install

3. Deployment (locally)
    npm start

## 💡 Usage

Creating a LinkHub

	•	Sign in to your account
	•	Click “Create LinkHub”
	•	Choose a unique username
	•	Start adding your links!

Managing Links

As an admin of your LinkHub, you can:

	•	Add new links with titles and URLs
	•	Edit existing links
	•	Delete links
	•	Search through your links
	•	Share your LinkHub URL with others

## 📧 Contact
  	•	Your Name - @suyash1011101
	•	Project Link: https://github.com/yourusername/linkhub
	•	Demo: https://linkhub.vercel.app/
