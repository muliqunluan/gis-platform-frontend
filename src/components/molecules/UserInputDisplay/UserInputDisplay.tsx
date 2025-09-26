import Card from "@/components/atoms/Card/Card";
import { Input } from "@/components/atoms/Input/Input";
import Title from "@/components/atoms/Title/Title";
import Button from "@/components/atoms/Button/Button";
import React, { useState } from "react";

const UserInputDisplay = () => {
    const [inputValue, setInputValue] = useState('');
    const [number, setNumber] = useState(0); 

    const handleNumberAdd = () => {
        // 使用 if 语句来实现循环递增
        if (number === 3) {
            // 如果数字是 3，就把它设置为 0
            setNumber(0);
        } else {
            // 否则，就让当前的数字加 1
            setNumber(number + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <Card>
            <Input onChange={handleInputChange} value={inputValue} placeholder="请输入内容..."></Input>
            <Title>{inputValue}</Title>
            <Button onClick={handleNumberAdd}>{number}</Button>
        </Card>
    );
};

export default UserInputDisplay;