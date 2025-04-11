'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  if (!token) {
    Swal.fire({
      title: 'Error',
      text: 'Invalid verification link',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/pre-order');
    });
    return null;
  }

  const verifyEmail = async () => {
    try {
      Swal.fire({
        title: 'Verifying...',
        text: 'Please wait while we verify your email',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Email verified successfully! Redirecting to login...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/pre-order');
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to verify email',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        router.push('/pre-order');
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'An error occurred while verifying your email',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      router.push('/pre-order');
    }
  };

  verifyEmail();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
