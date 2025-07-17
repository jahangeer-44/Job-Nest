 import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        file: '',
    });

    const { loading, user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-10">
                <form
                    onSubmit={submitHandler}
                    className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
                >
                    <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
                        Create an Account
                    </h1>

                    <div className="mb-4">
                        <Label className="block mb-1 text-sm font-medium text-gray-700">Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter your name"
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="block mb-1 text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter your phone number"
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="block mb-1 text-sm font-medium text-gray-700">Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <Label className="block mb-2 text-sm font-medium text-gray-700">Role</Label>
                        <RadioGroup className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                    id="r1"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                    id="r2"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="mb-6">
                        <Label className="block mb-1 text-sm font-medium text-gray-700">Profile Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={changeFileHandler}
                            className="cursor-pointer w-full"
                        />
                    </div>

                    {loading ? (
                        <Button className="w-full bg-indigo-600 text-white">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Signup
                        </Button>
                    )}

                    <p className="mt-4 text-sm text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
