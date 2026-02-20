'use client';

import VoucherPreview from '@/app/components/VoucherPreview';
import CreateVoucherForm from '@/app/(admin)/vouchers/create/CreateVoucherForm';
import { useCreateVoucher } from '@/app/(admin)/vouchers/create/useCreateVoucher';

export default function CreateVoucherPage() {
    const {
        code,
        setCode,
        title,
        setTitle,
        description,
        setDescription,
        discountType,
        setDiscountType,
        discountValue,
        setDiscountValue,
        minOrderValue,
        setMinOrderValue,
        maxUsagePerUser,
        setMaxUsagePerUser,
        forNewUser,
        setForNewUser,
        isActive,
        setIsActive,
        saving,
        previewOpen,
        setPreviewOpen,
        handleSubmit,
        handleCancel,
    } = useCreateVoucher();

    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
                {/* LEFT FORM */}
                <CreateVoucherForm
                    code={code}
                    setCode={setCode}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    discountType={discountType}
                    setDiscountType={setDiscountType}
                    discountValue={discountValue}
                    setDiscountValue={setDiscountValue}
                    minOrderValue={minOrderValue}
                    setMinOrderValue={setMinOrderValue}
                    maxUsagePerUser={maxUsagePerUser}
                    setMaxUsagePerUser={setMaxUsagePerUser}
                    forNewUser={forNewUser}
                    setForNewUser={setForNewUser}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    saving={saving}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onOpenPreview={() => setPreviewOpen(true)}
                />

                {/* RIGHT PREVIEW (Desktop only) */}
                <div className="hidden lg:block">
                    <VoucherPreview
                        code={code}
                        title={title}
                        description={description}
                        discountType={discountType}
                        discountValue={discountValue}
                        minOrderValue={minOrderValue}
                        maxUsagePerUser={maxUsagePerUser}
                        forNewUser={forNewUser}
                        isActive={isActive}
                    />
                </div>
            </div>
            {/* MOBILE PREVIEW MODAL */}
            {previewOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setPreviewOpen(false)}
                    />

                    {/* sheet */}
                    <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#F7F8FB] p-4 shadow-2xl">
                        <div className="flex justify-center">
                            <div className="h-1.5 w-10 rounded-full bg-gray-200" />
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-semibold text-[#1b4f94]">
                                Voucher
                            </div>

                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
                            >
                                X
                            </button>
                        </div>

                        <VoucherPreview
                            code={code}
                            title={title}
                            description={description}
                            discountType={discountType}
                            discountValue={discountValue}
                            minOrderValue={minOrderValue}
                            maxUsagePerUser={maxUsagePerUser}
                            forNewUser={forNewUser}
                            isActive={isActive}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
