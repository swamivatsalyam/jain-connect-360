import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const JainConnectSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  number: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .max(15, 'Invalid phone number length'),
  whatsappNumber: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits')
    .max(15, 'Invalid phone number length'),
  sampradaya: z
    .string()
    .min(1, 'Please select your Jain Sampradaya / Panth'),
  sammajSelection: z
    .string()
    .min(1, 'Please select your Sammaj or choose "Other"'),
  customSammaj: z
    .string()
    .optional(),
  state: z
    .string()
    .min(1, 'Please select your State'),
  citySelection: z
    .string()
    .min(1, 'Please select your City'),
  customCity: z
    .string()
    .optional(),
  businessName: z
    .string()
    .min(2, 'Please enter your business name or occupation'),
  volunteer: z
    .string()
    .optional(),
}).refine((data) => {
  if (data.sammajSelection === 'OTHER') {
    return !!data.customSammaj && data.customSammaj.trim().length > 2;
  }
  return true;
}, {
  message: 'Please enter your Sammaj name',
  path: ['customSammaj'],
}).refine((data) => {
  if (data.citySelection === 'Other') {
    return !!data.customCity && data.customCity.trim().length > 2;
  }
  return true;
}, {
  message: 'Please enter your City name',
  path: ['customCity'],
});

export type JainConnectFormValues = z.infer<typeof JainConnectSchema>;

interface JainConnectFormProps {
  googleWebhookUrl?: string;
  supabaseEndpoint?: string;
  supabaseAnonKey?: string;
  onSuccess?: (data: JainConnectFormValues) => void;
}

export const JainConnectForm: React.FC<JainConnectFormProps> = ({
  googleWebhookUrl,
  supabaseEndpoint,
  supabaseAnonKey,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsNumber, setSameAsNumber] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'gu' | 'hi'>('en');
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JainConnectFormValues>();

  const selectedSammaj = watch('sammajSelection');
  const selectedCity = watch('citySelection');
  const contactNumber = watch('number');

  const handleSameAsNumberToggle = (checked: boolean) => {
    setSameAsNumber(checked);
    if (checked && contactNumber) {
      setValue('whatsappNumber', contactNumber);
    }
  };

  const onSubmit = async (data: JainConnectFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    const resolvedSammaj = data.sammajSelection === 'OTHER' ? data.customSammaj! : data.sammajSelection;
    const resolvedCity = data.citySelection === 'Other' ? data.customCity! : data.citySelection;

    const payload = {
      id: 'JC360_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      fullName: data.fullName,
      number: data.number,
      whatsappNumber: data.whatsappNumber,
      sampradaya: data.sampradaya,
      sammajName: resolvedSammaj,
      state: data.state,
      city: resolvedCity,
      businessName: data.businessName,
      volunteer: data.volunteer || 'Not Specified',
      languageUsed: currentLang,
      verified: true,
    };

    try {
      if (googleWebhookUrl) {
        await fetch(googleWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (supabaseEndpoint && supabaseAnonKey) {
        await fetch(supabaseEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            full_name: data.fullName,
            contact_number: data.number,
            whatsapp_number: data.whatsappNumber,
            sampradaya: data.sampradaya,
            sammaj_name: resolvedSammaj,
            state: data.state,
            city: resolvedCity,
            business_name: data.businessName,
            volunteer: data.volunteer || 'Not Specified',
            language_used: currentLang,
          }),
        });
      }

      setSubmitStatus({
        type: 'success',
        message: 'Jai Jinendra! Your details have been successfully verified and connected.',
      });
      reset();
      setSameAsNumber(false);
      if (onSuccess) onSuccess(data);
    } catch (err: any) {
      setSubmitStatus({
        type: 'error',
        message: err?.message || 'Error submitting details. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      
      {/* Language Switcher */}
      <div className="flex justify-end gap-1 mb-6">
        {(['en', 'gu', 'hi'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setCurrentLang(lang)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              currentLang === lang ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Jain Connect 360 Degree</h2>
        <p className="text-amber-700 font-semibold text-sm mt-1">Connecting Every Jain</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Full Name *
          </label>
          <input
            {...register('fullName')}
            placeholder="e.g. Rameshchandra M. Shah"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Number & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Calling Number *
            </label>
            <input
              type="tel"
              {...register('number')}
              onChange={(e) => {
                register('number').onChange(e);
                if (sameAsNumber) setValue('whatsappNumber', e.target.value);
              }}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.number && <p className="text-xs text-rose-500 mt-1">{errors.number.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                WhatsApp Number *
              </label>
              <label className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsNumber}
                  onChange={(e) => handleSameAsNumberToggle(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Same</span>
              </label>
            </div>
            <input
              type="tel"
              {...register('whatsappNumber')}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.whatsappNumber && <p className="text-xs text-rose-500 mt-1">{errors.whatsappNumber.message}</p>}
          </div>
        </div>

        {/* Jain Sampradaya / Panth */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Jain Sampradaya / Panth *
          </label>
          <select
            {...register('sampradaya')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select Sampradaya / Panth...</option>
            <option value="Shwetambar Murtipujak">Shwetambar Murtipujak</option>
            <option value="Digambar">Digambar</option>
            <option value="Shwetambar Sthanakvasi">Shwetambar Sthanakvasi</option>
            <option value="Shwetambar Terapanthi">Shwetambar Terapanthi</option>
            <option value="Other">Other</option>
          </select>
          {errors.sampradaya && <p className="text-xs text-rose-500 mt-1">{errors.sampradaya.message}</p>}
        </div>

        {/* Sammaj */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Name of Sammaj *
          </label>
          <select
            {...register('sammajSelection')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select your Sammaj...</option>
            <option value="Visa Oswal">Visa Oswal</option>
            <option value="Dasa Oswal">Dasa Oswal</option>
            <option value="Kutchi Oswal">Kutchi Oswal</option>
            <option value="Porwal / Porwad">Porwal / Porwad</option>
            <option value="Shrimali">Shrimali</option>
            <option value="Khandelwal">Khandelwal</option>
            <option value="Parwar">Parwar</option>
            <option value="Humad">Humad</option>
            <option value="OTHER">Not found in list? Enter manually...</option>
          </select>
          {errors.sammajSelection && <p className="text-xs text-rose-500 mt-1">{errors.sammajSelection.message}</p>}
        </div>

        {/* Custom Sammaj */}
        {selectedSammaj === 'OTHER' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Enter Your Sammaj Name *
            </label>
            <input
              {...register('customSammaj')}
              placeholder="Type your Sammaj name..."
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.customSammaj && <p className="text-xs text-rose-500 mt-1">{errors.customSammaj.message}</p>}
          </div>
        )}

        {/* State & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              State *
            </label>
            <input
              {...register('state')}
              placeholder="e.g. Gujarat, Maharashtra, Rajasthan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              City / Town *
            </label>
            <input
              {...register('citySelection')}
              placeholder="e.g. Ahmedabad, Mumbai, Jaipur"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.citySelection && <p className="text-xs text-rose-500 mt-1">{errors.citySelection.message}</p>}
          </div>
        </div>

        {/* Business Name / Occupation */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Business Name / Occupation (What do you do?) *
          </label>
          <input
            {...register('businessName')}
            placeholder="e.g. Mahavir Textiles / Diamond Merchant / Software Engineer / Student"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.businessName && <p className="text-xs text-rose-500 mt-1">{errors.businessName.message}</p>}
        </div>

        {/* Volunteer for Jinshashan (Optional) */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              {currentLang === 'en'
                ? 'Do you want to become a volunteer for Jinshashan?'
                : currentLang === 'gu'
                ? 'શું આપ જિનશાસનની સેવા માટે સ્વયંસેવક (Volunteer) બનવા માંગો છો?'
                : 'क्या आप जिनशासन की सेवा हेतु स्वयंसेवक (Volunteer) बनना चाहते हैं?'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {currentLang === 'en' ? 'Optional' : currentLang === 'gu' ? 'વૈકલ્પિક' : 'वैकल्पिक'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:border-amber-400">
              <input type="radio" value="Yes" {...register('volunteer')} className="text-amber-600" />
              <span>{currentLang === 'en' ? '✨ Yes' : currentLang === 'gu' ? '✨ હા (Yes)' : '✨ हाँ (Yes)'}</span>
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 cursor-pointer hover:border-slate-300">
              <input type="radio" value="No" {...register('volunteer')} className="text-slate-600" />
              <span>{currentLang === 'en' ? 'No' : currentLang === 'gu' ? 'ના (No)' : 'नहीं (No)'}</span>
            </label>
          </div>
        </div>

        {/* Status Alert */}
        {submitStatus && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold ${
              submitStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Details'}
        </button>
      </form>
    </div>
  );
};
