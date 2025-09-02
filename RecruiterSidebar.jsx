// import React from 'react';
// import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { 
//   LayoutDashboard,
//   Briefcase,
//   Users,
//   Calendar,
//   BarChart4,
//   Settings,
//   LogOut,
//   X,
//   Menu
// } from 'lucide-react';
// import logo from '../Assets/logo.png';
// import Swal from 'sweetalert2';

// const RecruiterSidebar = ({ mobileOpen, setMobileOpen }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const buildPath = (subpath) => (subpath === '/' ? `/recruiter/${id}` : `/recruiter/${id}${subpath}`);

//   const isActive = (path) => location.pathname.startsWith(path);

//   const navItems = [
//     { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
//     { path: '/jobs', icon: Briefcase, label: 'Jobs' },
//     { path: '/candidates', icon: Users, label: 'Candidates' },
//     { path: '/calendar', icon: Calendar, label: 'Calendar' },
//     { path: '/analytics', icon: BarChart4, label: 'Analytics' },
//   ];

//   const bottomItems = [
//     { path: '/settings', icon: Settings, label: 'Settings' },
//     { path: '/logout', icon: LogOut, label: 'Logout' },
//   ];

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Confirm Logout',
//       text: 'Are you sure you want to sign out from your account?',
//       icon: 'question',
//       background: '#1A1A23',
//       color: '#FFFFFF',
//       showCancelButton: true,
//       confirmButtonColor: '#D53F8C',
//       cancelButtonColor: '#6B7280',
//       confirmButtonText: 'Yes, Logout',
//       cancelButtonText: 'Cancel',
//       customClass: {
//         popup: 'dark:bg-[#1A1A23] dark:text-white',
//         title: 'dark:text-white',
//         content: 'dark:text-gray-300',
//         confirmButton: 'hover:bg-[#C02F7A] transition-colors duration-200',
//         cancelButton: 'hover:bg-[#4B5563] transition-colors duration-200'
//       },
//       buttonsStyling: true,
//       reverseButtons: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Remove user data from storage
//         localStorage.removeItem('token');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userId');
        
//         // Show success message
//         Swal.fire({
//           title: 'Logged Out',
//           text: 'You have been successfully logged out.',
//           icon: 'success',
//           background: '#1A1A23',
//           color: '#FFFFFF',
//           confirmButtonColor: '#D53F8C',
//           timer: 1500,
//           showConfirmButton: false
//         }).then(() => {
//           navigate('/');
//         });
//       }
//     });
//   };

//   return (
//     <>
//       {/* Mobile Overlay with fade animation */}
//       {mobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity duration-300"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}
      
//       {/* Sidebar with smooth slide-in animation */}
//       <div className={`fixed top-0 left-0 h-full bg-[#1A1A23] text-white flex flex-col p-4 z-20
//         transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transition-transform duration-300 ease-in-out w-64 shadow-xl`}>
        
//         {/* Mobile Close Button */}
//         <button 
//           className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
//           onClick={() => setMobileOpen(false)}
//         >
//           <X size={24} />
//         </button>
        
//         <div className="mb-8 p-4 border-b border-gray-700 flex justify-center">
//           <img src={logo} alt="Alva Logo" className="h-16 w-20 transition-transform duration-300 hover:scale-105" />
//         </div>
        
//         <nav className="flex-1">
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const linkPath = buildPath(item.path);
//               return (
//                 <Link 
//                   key={item.path}
//                   to={linkPath} 
//                   className={`flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 relative overflow-hidden
//                     ${isActive(linkPath) ? 
//                       'text-white bg-gradient-to-r from-[#4B1E66] to-[#D53F8C] hover:from-[#3F1A55] hover:to-[#C02F7A] rounded-r-none' : 
//                       'hover:bg-[#2D2D3A]'}`}
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive(linkPath) ? 'bg-[#F7A8B8]' : 'bg-transparent'} transition-colors duration-200`} />
//                   <item.icon className={`w-5 h-5 mr-3 ${isActive(linkPath) ? 'text-[#F7A8B8]' : 'text-gray-400'} transition-colors duration-200`} />
//                   <span className="transition-colors duration-200">{item.label}</span>
//                   {isActive(linkPath) && (
//                     <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 
//                       border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#1A1A23] transition-all duration-200" />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>
        
//         <div className="mt-auto space-y-1">
//           {bottomItems.map((item) => {
//             if (item.label === 'Logout') {
//               return (
//                 <button
//                   key="logout"
//                   onClick={() => {
//                     setMobileOpen(false);
//                     handleLogout();
//                   }}
//                   className={`w-full text-left flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 relative overflow-hidden
//                     hover:bg-[#2D2D3A]`}
//                 >
//                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent transition-colors duration-200" />
//                   <item.icon className="w-5 h-5 mr-3 text-gray-400 transition-colors duration-200" />
//                   <span className="transition-colors duration-200">{item.label}</span>
//                 </button>
//               );
//             } else {
//               const linkPath = buildPath(item.path);
//               return (
//                 <Link 
//                   key={item.path}
//                   to={linkPath} 
//                   className={`flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 relative overflow-hidden
//                     ${isActive(linkPath) ? 
//                       'text-white bg-gradient-to-r from-[#4B1E66] to-[#D53F8C] hover:from-[#3F1A55] hover:to-[#C02F7A] rounded-r-none' : 
//                       'hover:bg-[#2D2D3A]'}`}
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive(linkPath) ? 'bg-[#F7A8B8]' : 'bg-transparent'} transition-colors duration-200`} />
//                   <item.icon className={`w-5 h-5 mr-3 ${isActive(linkPath) ? 'text-[#F7A8B8]' : 'text-gray-400'} transition-colors duration-200`} />
//                   <span className="transition-colors duration-200">{item.label}</span>
//                   {isActive(linkPath) && (
//                     <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 
//                       border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#1A1A23] transition-all duration-200" />
//                   )}
//                 </Link>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default RecruiterSidebar;













import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart4,
  User,
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react';
import logo from '../Assets/logo.png';
import Swal from 'sweetalert2';

const RecruiterSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Build full path including recruiter id param
// Only the updated lines
const buildPath = (subpath) =>
  subpath === '/' ? `/recruiter/${id}` : `/recruiter/${id}${subpath}`;

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/candidates', icon: Users, label: 'Candidates' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/analytics', icon: BarChart4, label: 'Analytics' },
  ];

  const bottomItems = [
    // { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/logout', icon: LogOut, label: 'Logout' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to sign out from your account?',
      icon: 'question',
      background: '#1A1A23',
      color: '#FFFFFF',
      showCancelButton: true,
      confirmButtonColor: '#D53F4C',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'dark:bg-[#1A1A23] dark:text-white',
        title: 'dark:text-white',
        content: 'dark:text-gray-300',
        confirmButton: 'hover:bg-[#C02F7A] transition-colors duration-200',
        cancelButton: 'hover:bg-[#4B5563] transition-colors duration-200'
      },
      buttonsStyling: true,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          background: '#1A1A23',
          color: '#FFFFFF',
          confirmButtonColor: '#D53F4C',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#1A1A23] text-white flex flex-col p-4 z-20
          transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out w-64 shadow-xl`}
      >
        {/* Mobile Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="mb-8 p-4 border-b border-gray-700 flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-20 transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          <div className="space-y-1">
            {navItems.map((item) => {
              const fullPath = buildPath(item.path);
              return (
                <Link
                  key={item.path}
                  to={fullPath}
                  className={`flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 relative overflow-hidden
                    ${isActive(fullPath)
                      ? 'text-white bg-gradient-to-r from-[#6D28D9] to-[#EC4899] hover:from-[#5B21B6] hover:to-[#DB2777] rounded-r-none'
                      : 'hover:bg-[#2C2C34]'
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive(fullPath) ? 'bg-pink-400' : 'bg-transparent'} transition-colors duration-200`} />
                  <item.icon
                    className={`w-5 h-5 mr-3 ${isActive(fullPath) ? 'text-pink-400' : 'text-gray-400'} transition-colors duration-200`}
                  />
                  <span className="transition-colors duration-200">{item.label}</span>
                  {isActive(fullPath) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0
                      border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#1A1A23] transition-all"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Items */}
        <div className="mt-auto space-y-1">
          {bottomItems.map((item) => {
            if (item.label === "Logout") {
              return (
                <button
                  key="logout"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 overflow-hidden hover:bg-[#2C2C34]"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent transition-colors duration-200" />
                  <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="transition-colors duration-200">{item.label}</span>
                </button>
              );
            } else {
              const fullPath = buildPath(item.path);
              return (
                <Link
                  key={item.path}
                  to={fullPath}
                  className={`flex items-center p-3 rounded-lg text-gray-200 transition-all duration-200 overflow-hidden
                    ${isActive(fullPath)
                      ? 'text-white bg-gradient-to-r from-[#6D28D9] to-[#EC4899] hover:from-[#5B21B6] hover:to-[#DB2777] rounded-r-none'
                      : 'hover:bg-[#2C2C34]'
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive(fullPath) ? 'bg-pink-400' : 'bg-transparent'} transition-colors duration-200`} />
                  <item.icon className={`w-5 h-5 mr-3 ${isActive(fullPath) ? 'text-pink-400' : 'text-gray-400'}`} />
                  <span className="transition-colors duration-200">{item.label}</span>
                  {isActive(fullPath) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0
                      border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#1A1A23] transition-all"
                    />
                  )}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default RecruiterSidebar;
