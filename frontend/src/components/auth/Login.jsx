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
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        role: '',
    });

    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || 'Network error. Please try again!';
            toast.error(errorMsg);
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
                        Login to Your Account
                    </h1>

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
                            Login
                        </Button>
                    )}

                    <p className="mt-4 text-sm text-center">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 hover:underline">
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
