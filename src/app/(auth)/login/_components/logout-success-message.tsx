'use client';

import { useEffect } from 'react';

import { toast } from '@/components/ui/toast';
import { routePaths } from '@/configs/route.path';

const LOGOUT_SUCCESS_MESSAGE = 'با موفقیت از حساب کاربری خارج شدید.';

export function LogoutSuccessMessage() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get('logout') !== 'success') {
      return;
    }

    toast.add({ type: 'success', title: LOGOUT_SUCCESS_MESSAGE });
    window.history.replaceState(null, '', routePaths.login);
  }, []);

  return null;
}
