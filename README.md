# AdminPanel-IICT

A modern, secure admin panel built with Next.js for managing hackathon team registrations, selections, and submissions. This application provides a comprehensive dashboard for administrators to oversee the entire hackathon lifecycle from team registration to final submissions.

## 🚀 Features

### Core Features
- **Team Management**: View, filter, and manage all registered teams
- **Team Selection**: Select teams for the next phase of the hackathon
- **Submission Tracking**: Monitor and review team submissions (PPT, repository, video)
- **Admin Authentication**: Secure login and registration system with JWT-based authentication
- **Analytics Dashboard**: Track key metrics and team statistics
- **Real-time Updates**: Live data synchronization across the dashboard

### Security Features
- JWT-based authentication with secure token management
- Password hashing using bcrypt
- Rate limiting to prevent abuse
- Security headers (CSP, XSS Protection, Frame Options)
- Input validation and sanitization
- Protected API routes with middleware authentication

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for data persistence
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing

### Additional Libraries
- **date-fns** - Date manipulation
- **next-themes** - Theme management
- **sonner** - Toast notifications
- **cmdk** - Command menu

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**, **pnpm**, or **yarn** package manager
- **MongoDB** (local instance or MongoDB Atlas account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/XploY04/AdminPanel-IICT.git
   cd AdminPanel-IICT
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/hackathon-admin
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon-admin

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-secure-jwt-secret-key-here

   # Admin Registration Access Code (optional, for restricting admin registration)
   ADMIN_REGISTRATION_ACCESS_CODE=your-secret-access-code

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up MongoDB**
   
   - Ensure MongoDB is running locally, or
   - Create a MongoDB Atlas cluster and get the connection string
   - The application will automatically create the required collections

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
# or
pnpm build && pnpm start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
AdminPanel-IICT/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard pages
│   │   ├── analytics/       # Analytics page
│   │   ├── selected-teams/  # Selected teams management
│   │   └── teams/           # Teams listing page
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin-specific APIs
│   │   ├── analytics/       # Analytics endpoints
│   │   └── auth/            # Authentication endpoints
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects)
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── admin-layout.tsx     # Admin dashboard layout
│   ├── auth-provider.tsx    # Authentication context
│   ├── team-card.tsx        # Team display card
│   └── theme-provider.tsx   # Theme management
├── lib/                     # Utility libraries
│   ├── analytics.ts         # Analytics utilities
│   ├── auth.ts              # Authentication helpers
│   ├── mongodb.ts           # MongoDB connection
│   ├── security.ts          # Security utilities
│   └── utils.ts             # General utilities
├── types/                   # TypeScript type definitions
│   ├── analytics.ts
│   ├── team.ts
│   └── user.ts
├── hooks/                   # Custom React hooks
├── styles/                  # Global styles
├── public/                  # Static assets
├── middleware.ts            # Next.js middleware
└── scripts/                 # Utility scripts
```

## 🔑 Key Concepts

### Data Models

#### Team
```typescript
{
  team_name: string
  team_size: number
  idea_title: string
  idea_document_url: string
  participants: Participant[]
  status: "registered"
  selected: boolean
  createdAt: Date
}
```

#### Participant
```typescript
{
  name: string
  email: string
  age: number
  phone: string
  student_or_professional: string
  college_or_company_name: string
  github_profile: string
  linkedin_profile: string
  devfolio_profile: string
}
```

#### Submission
```typescript
{
  team_id: string
  submission_document_url: {
    ppt?: string
    repo?: string
    video?: string
  }[]
  createdAt: string
  updatedAt: string
}
```

## 🔐 Authentication Flow

1. **Admin Registration**: Admins register using the `/register` page (optionally requires access code)
2. **Login**: Admins log in with credentials at `/login`
3. **Token Generation**: JWT token is generated and stored in cookies
4. **Protected Routes**: Middleware verifies tokens for admin routes
5. **Auto Redirect**: Unauthenticated users are redirected to login

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register-admin` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/verify-registration-access` - Verify registration access code

### Teams
- `GET /api/admin/teams` - Get all registered teams
- `GET /api/admin/teams/selected` - Get selected teams
- `POST /api/admin/teams/[id]/select` - Select/deselect a team
- `GET /api/admin/teams/submissions` - Get team submissions

### Analytics
- `POST /api/analytics/click-tracking` - Track user interactions

## 🎨 UI Components

The application uses a comprehensive set of UI components from Radix UI:
- Accordion, Alert Dialog, Avatar
- Buttons, Cards, Checkboxes
- Dialogs, Dropdowns, Forms
- Navigation, Tabs, Toast Notifications
- And many more...

All components are styled with Tailwind CSS and support dark mode.

## 🌙 Theme Support

The application includes a theme system with:
- Light mode
- Dark mode
- System preference detection
- Persistent theme storage

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Password Hashing**: All passwords are hashed with bcrypt
4. **Input Validation**: Zod schemas validate all inputs
5. **Rate Limiting**: Basic rate limiting on API routes
6. **Security Headers**: CSP, XSS protection, frame options configured
7. **MongoDB Connection**: Use connection pooling and secure credentials

## 🧪 Testing

The application structure supports testing with:
- Unit tests for utilities and components
- Integration tests for API routes
- E2E tests for critical user flows

To add tests, consider using:
- **Jest** for unit testing
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for E2E tests

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Docker
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- AWS (Amplify, EC2, ECS)
- Google Cloud Platform
- DigitalOcean
- Heroku
- Railway

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comments for complex logic
- Ensure all components are typed
- Run linting before committing

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env.local`
- Ensure network access for MongoDB Atlas

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Authentication Issues
- Verify JWT_SECRET is set in environment variables
- Clear browser cookies and try again
- Check token expiration settings

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **XploY04** - [GitHub Profile](https://github.com/XploY04)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Vercel for hosting platform
- MongoDB for the database solution
- All contributors who help improve this project

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Email notifications for team selection
- [ ] Export team data to CSV/Excel
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app companion
- [ ] Real-time collaboration features
- [ ] Automated team evaluation scoring
- [ ] Integration with external APIs (GitHub, DevFolio)

---

**Note**: This is an admin panel for internal use. Ensure proper security measures are in place before deploying to production.
