import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const defaultAvatar =
    "https://i.pinimg.com/736x/4b/90/5b/4b905b1342b5635310923fd10319c265.jpg";

  const resumeLink = user?.profile?.resume;
  const resumeName = user?.profile?.resumeOriginalName;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto || defaultAvatar}
                alt="User Avatar"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{user?.profile?.bio || "No bio added"}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email || "NA"}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber || "NA"}</span>
          </div>
        </div>

        <div className="my-5">
          <h1 className="font-semibold">Skills</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-base font-semibold text-gray-700">
            Resume{" "}
            <span className="text-sm font-normal text-gray-500">
              (Only Image)
            </span>
          </Label>

          {resumeLink ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={resumeLink}
              className="text-blue-500 w-full hover:underline cursor-pointer"
            >
              {resumeName || "View Resume"}
            </a>
          ) : (
            <span className="text-gray-500">Resume not uploaded</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
