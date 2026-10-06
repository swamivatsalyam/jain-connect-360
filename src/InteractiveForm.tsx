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
    .optional()
    .refine((val) => !val || (val.replace(/[^0-9]/g, '').length >= 10 && val.replace(/[^0-9]/g, '').length <= 15), {
      message: 'WhatsApp number must be between 10 and 15 digits',
    }),
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

const heroContent = {
  en: {
    title: 'Jain Connect 360°',
    subtitle: 'Connecting Every Jain',
    goals: ['🛡️ Dharam Raksha', '🏛️ Tirth Raksha', '🤝 Swami Vatsalyam'],
    purposeBadge: 'Our Sacred Mission & Purpose',
    purposeQ: 'Question: How do I fill out this form?',
    purposeAPrefix: 'Answer',
    purposeA:
      'Through this form, in the future, if you ever need to increase the business level of your family, instead of personally benefiting from it, the idea is that your fellow Jain brothers can purchase through you and the money is used in the right place. With this purpose, and in matters related to defending the faith, you can volunteer for Jain Connect 360, which is a platform for protecting the religion.',
  },
  gu: {
    title: 'જૈન કનેક્ટ 360°',
    subtitle: 'દરેક જૈનને જોડતો સેતુ',
    goals: ['🛡️ ધર્મ રક્ષા', '🏛️ તીર્થ રક્ષા', '🤝 સ્વામી વાત્સલ્ય'],
    purposeBadge: 'આપણો પાવન સંકલ્પ અને ઉદ્દેશ્ય',
    purposeQ: 'પ્રશ્ન: આ ફોર્મ શા માટે ભરવું અને તેનો હેતુ શું છે?',
    purposeAPrefix: 'જવાબ',
    purposeA:
      'આ ફોર્મ દ્વારા ભવિષ્યમાં તમારા પરિવારનો વ્યાપાર-રોજગાર વધારવા માટે, માત્ર અંગત લાભ ખાતર નહીં, પરંતુ સાધર્મિક જૈન ભાઈઓ આપણી પાસેથી જ ખરીદી કરે અને લક્ષ્મીનો સદુપયોગ સાચી જગ્યાએ ધર્મકાર્યમાં થાય તે મુખ્ય વિચાર છે. આ પવિત્ર હેતુ સાથે તથા ધર્મ રક્ષાના કાર્યોમાં આપ જૈન કનેક્ટ ૩૬૦ સાથે જોડાઈને શાસન રક્ષાના આ પ્લેટફોર્મ પર સ્વયંસેવક બની શકો છો.',
  },
  hi: {
    title: 'जैन कनेक्ट 360°',
    subtitle: 'हर जैन को जोड़ने वाला मंच',
    goals: ['🛡️ धर्म रक्षा', '🏛️ तीर्थ रक्षा', '🤝 स्वामी वात्सल्य'],
    purposeBadge: 'हमारा पावन संकल्प और उद्देश्य',
    purposeQ: 'प्रश्न: यह फॉर्म क्यों भरें और इसका क्या उद्देश्य है?',
    purposeAPrefix: 'उत्तर',
    purposeA:
      'इस फॉर्म के माध्यम से भविष्य में आपके परिवार के व्यापार की वृद्धि हेतु, केवल व्यक्तिगत लाभ के लिए नहीं, बल्कि हमारे साथी जैन भाई आपसे ही खरीदारी करें और धन का सदुपयोग सही स्थान पर धर्मकार्य में हो — यही मुख्य विचार है। इसी पावन उद्देश्य के साथ तथा धर्म की रक्षा से जुड़े कार्यों में आप जैन कनेक्ट 360 से जुड़कर शासन रक्षा के इस मंच पर स्वयंसेवक बन सकते हैं।',
  },
};

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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{heroContent[currentLang].title}</h2>
        <p className="text-amber-700 font-semibold text-sm mt-1">{heroContent[currentLang].subtitle}</p>

        {/* 3 Sacred Goals / Pillars */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-3.5">
          {heroContent[currentLang].goals.map((goal, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
            >
              {goal}
            </span>
          ))}
        </div>

        {/* Sacred Purpose & Motivation Q&A Card */}
        <div className="mt-4 text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/90 to-orange-50/60 border border-amber-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
              {heroContent[currentLang].purposeBadge}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {heroContent[currentLang].purposeQ}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-normal">
              <span className="font-bold text-amber-900">{heroContent[currentLang].purposeAPrefix}: </span>
              {heroContent[currentLang].purposeA}
            </p>
          </div>
        </div>
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
              <div className="flex items-center gap-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  WhatsApp Number
                </label>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">Optional</span>
              </div>
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
            <option value="Shree Vaav Community">Shree Vaav Community</option>
            <option value="Shree Kutch Shree Vagad Saat Chovisi Community">Shree Kutch Shree Vagad Saat Chovisi Community</option>
            <option value="Shree 108 Visa Shrimali Chanasma Community">Shree 108 Visa Shrimali Chanasma Community</option>
            <option value="Shree Rander Ladva Shrimali Community">Shree Rander Ladva Shrimali Community</option>
            <option value="Shree Rohi Pargana Community">Shree Rohi Pargana Community</option>
            <option value="Shree Dhandhar Visa Porwad Community">Shree Dhandhar Visa Porwad Community</option>
            <option value="Shree Ghoghari Visa Oswal Community">Shree Ghoghari Visa Oswal Community</option>
            <option value="Shree Dasha Oswal Community">Shree Dasha Oswal Community</option>
            <option value="Shree Abu Road Oswal Community">Shree Abu Road Oswal Community</option>
            <option value="Shree Kankrej (Kakareji) Betalisi Community">Shree Kankrej (Kakareji) Betalisi Community</option>
            <option value="Shree Nutan Sadtrisi Visa Community">Shree Nutan Sadtrisi Visa Community</option>
            <option value="Shree Siwanchi (Sivanthi) Malani Jain Community">Shree Siwanchi (Sivanthi) Malani Jain Community</option>
            <option value="Shree Navagam Community">Shree Navagam Community</option>
            <option value="Shree Sinor Dasha Oswal Community">Shree Sinor Dasha Oswal Community</option>
            <option value="Shree Baragam Jain Community">Shree Baragam Jain Community</option>
            <option value="Shree Miyagam Radhanpura Visa Shrimali Community">Shree Miyagam Radhanpura Visa Shrimali Community</option>
            <option value="Shree Dasha Shrimali Jhalawad Community">Shree Dasha Shrimali Jhalawad Community</option>
            <option value="Shree Ladva (Laduaa) Shrimali Community">Shree Ladva (Laduaa) Shrimali Community</option>
            <option value="Shree Ghoghari Visa Shrimali Jain Community">Shree Ghoghari Visa Shrimali Jain Community</option>
            <option value="Shree Jhalawadi Community">Shree Jhalawadi Community</option>
            <option value="Shree Trisutik (Tharad) Jain Samaj">Shree Trisutik (Tharad) Jain Samaj</option>
            <option value="Shree Bhabhar Community">Shree Bhabhar Community</option>
            <option value="Shree Khimat Community">Shree Khimat Community</option>
            <option value="Shree Dhanera Community">Shree Dhanera Community</option>
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

      {/* Community & Support Section (WhatsApp QR + Payment QR) */}
      <div className="mt-8 pt-6 border-t border-slate-100 space-y-5">
        <div className="text-center space-y-1">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            {currentLang === 'en'
              ? 'Official Community & Seva Support'
              : currentLang === 'gu'
              ? 'સામુહિક જોડાણ અને સેવા સહયોગ'
              : 'सामुदायिक जुड़ाव एवं सेवा सहयोग'}
          </span>
          <p className="text-xs text-slate-600">
            {currentLang === 'en'
              ? 'Connect with fellow Jains and contribute towards our sacred mission.'
              : currentLang === 'gu'
              ? 'સાધર્મિક બંધુઓ સાથે જોડાઓ અને શાસન રક્ષાના પાવન કાર્યમાં સહભાગી બનો.'
              : 'साधार्मिक बंधुओं से जुड़ें और शासन रक्षा के पावन कार्य में सहभागी बनें।'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp Community QR */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col items-center text-center space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {currentLang === 'en'
                  ? 'Join WhatsApp Community'
                  : currentLang === 'gu'
                  ? 'વોટ્સએપ કોમ્યુનિટીમાં જોડાઓ'
                  : 'व्हाट्सएप कम्युनिटी से जुड़ें'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentLang === 'en'
                  ? 'Business networking & updates'
                  : currentLang === 'gu'
                  ? 'વ્યાપાર નેટવર્કિંગ અને અપડેટ્સ'
                  : 'व्यापार नेटवर्किंग एवं अपडेट्स'}
              </p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-emerald-200 shadow-xs">
              <img
                src="/assets/whatsapp_qr.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https%3A%2F%2Fchat.whatsapp.com%2FIkS1QcmmdUbAQAZrObyiDQ';
                }}
                alt="WhatsApp Community QR"
                className="w-32 h-32 object-contain rounded-md"
              />
            </div>
            <a
              href="https://chat.whatsapp.com/IkS1QcmmdUbAQAZrObyiDQ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition"
            >
              {currentLang === 'en'
                ? 'Join WhatsApp Group'
                : currentLang === 'gu'
                ? 'વોટ્સએપ ગ્રુપમાં જોડાઓ'
                : 'व्हाट्सएप ग्रुप से जुड़ें'}
            </a>
          </div>

          {/* Payment Support QR */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col items-center text-center space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {currentLang === 'en'
                  ? 'Donation & Seva Support'
                  : currentLang === 'gu'
                  ? 'દાન અને સેવા સહયોગ'
                  : 'दान एवं सेवा सहयोग'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentLang === 'en'
                  ? 'Dharam & Tirth Raksha Contribution'
                  : currentLang === 'gu'
                  ? 'ધર્મ અને તીર્થ રક્ષામાં સહયોગ'
                  : 'धर्म एवं तीर्थ रक्षा में सहयोग'}
              </p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-xs">
              <img
                src="/assets/payment_qr.jpg"
                alt="Donation & Payment QR"
                className="w-32 h-32 object-contain rounded-md"
              />
            </div>
            <div className="w-full py-2 px-2 rounded-xl bg-amber-100 text-amber-900 font-semibold text-[10px] text-center">
              {currentLang === 'en'
                ? 'Scan via UPI (GPay / PhonePe / Paytm)'
                : currentLang === 'gu'
                ? 'કોઈપણ UPI એપ વડે સ્કેન કરો'
                : 'किसी भी UPI ऐप से स्कैन करें'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
