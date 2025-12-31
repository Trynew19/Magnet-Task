import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Requirement #7: Login user ki details fetch karna
        const { data } = await api.get('/auth/me'); 
        setProfile(data.data);
      } catch (err) { 
        console.log("Profile fetch failed"); 
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    /* Card Container: Image_3cc106 jaisa rounded aur soft shadow */
    <div className="p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm mb-8 transition-all hover:shadow-md group">
      <div className="flex items-center gap-4">
        


        {/* User Info */}
        <div className="flex flex-col overflow-hidden">
          <h4 className="font-extrabold text-[17px] text-[#1E293B] truncate leading-tight tracking-tight">
            {profile.name}
          </h4>
          
          {/* <div className="flex items-center gap-1.5 mt-1 text-[#94A3B8]">
            <Mail size={13} strokeWidth={2} />
            <p className="text-[12px] font-medium truncate">
              {profile.email}
            </p>
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;