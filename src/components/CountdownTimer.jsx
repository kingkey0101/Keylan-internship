import React, { useEffect, useRef, useState } from 'react'

const CountdownTimer = ({expiryDate}) => {
    const [timeLeft, setTimeLeft] = useState('');
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    useEffect(()=>{
        isMounted.current = true;
        if((!expiryDate)) return;

        const target = new Date(expiryDate).getTime();

        intervalRef.current = setInterval(() => {
            
        }, ((interval=>{
            const now = new Date().getTime();
            const diff = target - now;
            
        })));
    })
}

export default CountdownTimer
