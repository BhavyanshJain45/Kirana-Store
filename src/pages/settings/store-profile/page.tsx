import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../../store/authStore';
import { useStoreProfileStore, type StoreProfile } from '../../../../store/storeProfileStore';

export default function StoreProfilePage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const profile = useStoreProfileStore((state) => state.profile);
  const load = useStoreProfileStore((state) => state.load);
  const save = useStoreProfileStore((state) => state.save);
  const { register, handleSubmit, reset } = useForm<StoreProfile>({ defaultValues: profile });

  useEffect(() => {
    if (!user?.uid) return;
    load(user.uid)
      .then(() => reset(useStoreProfileStore.getState().profile))
      .catch(() => undefined);
  }, [load, reset, user?.uid]);

  const onSubmit = async (data: StoreProfile): Promise<void> => {
    if (!user?.uid) return;
    await save(user.uid, data);
  };

  return (
    <form className="card grid gap-2 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Store Name" {...register('storeName', { required: true })} />
      <input placeholder="Owner Name" {...register('ownerName', { required: true })} />
      <input placeholder="GSTIN" {...register('gstin', { required: true })} />
      <input placeholder="State Code" {...register('stateCode', { required: true })} />
      <input placeholder="Phone" {...register('phone', { required: true })} />
      <textarea className="md:col-span-2" placeholder="Address" {...register('address', { required: true })} />
      <button className="bg-brand-600 text-white hover:bg-brand-500 md:col-span-2" type="submit">
        Save Profile
      </button>
    </form>
  );
}
