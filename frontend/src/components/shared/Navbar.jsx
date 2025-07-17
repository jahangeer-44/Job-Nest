import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-[#6A38C2] shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-white">Job</span>
            <span className="text-[#F8C102]">Nest</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className={`transition duration-200 ${
                      isActive("/admin/companies")
                        ? "text-yellow-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className={`transition duration-200 ${
                      isActive("/admin/jobs")
                        ? "text-yellow-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={`transition duration-200 ${
                      isActive("/")
                        ? "text-yellow-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className={`transition duration-200 ${
                      isActive("/jobs")
                        ? "text-yellow-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className={`transition duration-200 ${
                      isActive("/browse")
                        ? "text-yellow-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  className="border border-white text-black hover:bg-white hover:text-[#6A38C2] transition duration-200 cursor-pointer"
                  variant="outline"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#F8C102] text-black hover:bg-[#e6b400] transition duration-200 cursor-pointer">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://i.pinimg.com/736x/4b/90/5b/4b905b1342b5635310923fd10319c265.jpg"
                    }
                    alt="User Avatar"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-[#6A38C2]">
                <div className="bg-[#6A38C2]">
                  <div className="flex gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://i.pinimg.com/736x/4b/90/5b/4b905b1342b5635310923fd10319c265.jpg"
                        }
                        alt="User Avatar"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white">
                        {user?.fullname}
                      </h4>
                      <p className="text-sm text-[#F8C102]">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600 gap-2">
                    {user && user.role === "student" && (
                      <Link to="/profile" className="w-fit">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-indigo-100 text-gray-800 transition cursor-pointer">
                          <User2 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            View Profile
                          </span>
                        </div>
                      </Link>
                    )}
                    <div
                      onClick={logoutHandler}
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-red-100 text-gray-800 transition cursor-pointer w-fit"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Logout</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
