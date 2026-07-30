import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  X, Edit3, Palette, Link2, MapPin, Star, Save, Plus,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const tabs = [
  { key: "details", labelAr: "التفاصيل", labelEn: "Details", icon: Edit3 },
  { key: "design", labelAr: "تصميم", labelEn: "Design", icon: Palette },
  { key: "links", labelAr: "الروابط", labelEn: "Links", icon: Link2 },
  { key: "locations", labelAr: "المواقع", labelEn: "Locations", icon: MapPin },
];

const uploadFields = [
  { labelAr: "إضافة صورة الخلفية", labelEn: "Add Background Image", hint: "PNG or JPG · max 1125×432px", btn: "Upload" },
  { labelAr: "إضافة الشعار", labelEn: "Add Logo", hint: "PNG or JPG · Square", btn: "Upload" },
];

export function EditCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const [showActionBar, setShowActionBar] = useState(true);
  const [cardBg, setCardBg] = useState("#7c88c4");
  const [barBg, setBarBg] = useState("#111111");
  const [textColor, setTextColor] = useState("#ffffff");
  const [images, setImages] = useState<string[]>(Array(2).fill(""));
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [rewardType, setRewardType] = useState("coupon");
  const [pointsRequired, setPointsRequired] = useState(4);
  const [rewardName, setRewardName] = useState("");
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [locations, setLocations] = useState<{ name: string; lat: number; lng: number; address: string; notification: string }[]>([]);
  const [locName, setLocName] = useState("");
  const [locLat, setLocLat] = useState(24.7136);
  const [locLng, setLocLng] = useState(46.6753);
  const [locAddress, setLocAddress] = useState("");
  const [locNotification, setLocNotification] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const leafletMarker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (activeTab !== "locations" || !mapRef.current) return;
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([locLat, locLng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(leafletMap.current);
      leafletMap.current.on("click", (e: L.LeafletMouseEvent) => {
        setLocLat(parseFloat(e.latlng.lat.toFixed(4)));
        setLocLng(parseFloat(e.latlng.lng.toFixed(4)));
      });
    }
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [activeTab]);

  useEffect(() => {
    if (!leafletMap.current) return;
    if (leafletMarker.current) leafletMarker.current.remove();
    leafletMarker.current = L.marker([locLat, locLng]).addTo(leafletMap.current);
    leafletMap.current.setView([locLat, locLng]);
  }, [locLat, locLng]);

  useEffect(() => {
    if (!id) return;
    const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]") as any[];
    const card = savedCards.find((c: any) => String(c.id) === id);
    if (card) {
      setCardBg(card.bgColor || "#7c88c4");
      setTextColor(card.textColor || "#ffffff");
      setCardName(card.name || "");
      setCardDescription(card.description || "");
      setRewardType(card.rewardType || "coupon");
      setPointsRequired(card.totalStages || 4);
      setRewardName(card.title || card.rewardName || "");
      setLinks(card.links || []);
      setLocations(card.locations || []);
      const imgs = ["", ""];
      if (card.bgImage) imgs[0] = card.bgImage;
      if (card.logo) imgs[1] = card.logo;
      setImages(imgs);
    }
  }, [id]);

  const handleAddLink = () => {
    if (!linkName.trim() || !linkUrl.trim()) return;
    setLinks(prev => [...prev, { name: linkName, url: linkUrl }]);
    setLinkName("");
    setLinkUrl("");
  };

  const handleAddLocation = () => {
    if (!locName.trim()) return;
    setLocations(prev => [...prev, { name: locName, lat: locLat, lng: locLng, address: locAddress, notification: locNotification }]);
    setLocName("");
    setLocAddress("");
    setLocNotification("");
  };

  const handleSave = () => {
    if (id) {
      const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]") as any[];
      const idx = savedCards.findIndex((c: any) => String(c.id) === id);
      if (idx !== -1) {
        savedCards[idx] = {
          ...savedCards[idx],
          name: cardName,
          title: rewardName,
          description: cardDescription,
          rewardName,
          rewardType,
          totalStages: pointsRequired,
          bgColor: cardBg,
          textColor,
          bgImage: images[0],
          logo: images[1],
          links,
          locations,
        };
        localStorage.setItem("dashboard_cards", JSON.stringify(savedCards));
      }
    }
    toast.success(isArabic ? "تم حفظ التغييرات بنجاح!" : "Changes saved successfully!");
    setTimeout(() => navigate("/dashboard/cards"), 1500);
  };

  const tabOrder = ["details", "design", "links", "locations"] as const;
  const goToNextTab = () => {
    const idx = tabOrder.indexOf(activeTab as typeof tabOrder[number]);
    if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
  };

  return (
    <div className="px-4 md:px-6 pt-3 pb-2 bg-[#fafbff] min-h-screen">
      {showActionBar && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 mb-3" dir={dir}>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {(isArabic ? "رفع التحديثات" : "Publish Updates")}
            </button>
            <div>
              <p className="text-xs font-bold text-gray-800">{(isArabic ? "رفع التحديثات" : "Publish Updates")}</p>
              <p className="text-[10px] text-gray-500">{(isArabic ? "اضغط على هذا الزر لنشر التغييرات على جميع البطاقات" : "Click this button to publish changes to all cards")}</p>
            </div>
          </div>
          <button onClick={() => setShowActionBar(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {/* Left: Preview */}
        <div className="border border-[#e5e7eb] rounded-xl bg-white shadow-sm p-1.5 flex flex-col items-center justify-center w-fit self-start">
          <div className="relative flex flex-col items-center" dir="ltr">
            <div className="overflow-hidden relative w-[200px]">
              <img alt="" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
              <div className="absolute w-[85%] h-[72%] left-[7.5%] top-[14%] rounded-[16px] overflow-hidden flex flex-col p-2.5" style={{ backgroundColor: cardBg, color: textColor, ...(images[0] ? { backgroundImage: `url(${images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }} dir={dir}>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  {images[1] && <img src={images[1]} alt="logo" className="w-4 h-4 rounded-full object-cover shrink-0" />}
                  <div className="text-center">
                    <div className="text-[9px] font-bold leading-tight tracking-tight">{cardName || (isArabic ? "نادي اللياقة النخبة" : "Elite Fitness Club")}</div>
                    <div className="text-[6px] font-semibold inline-block px-1 rounded-sm" style={{ backgroundColor: barBg, color: textColor }}>{isArabic ? "المرحلة" : "Stage"}: 1/7</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-[2px] mb-0.5">
                  {Array.from({ length: pointsRequired }).map((_, index) => (
                    <Star key={index} className={index === pointsRequired - 1 ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.8)]' : 'fill-yellow-500/30 text-yellow-500/30'} size={7} strokeWidth={1.5} />
                  ))}
                </div>
                <div className="mx-3 mb-0.5" style={{ height: "1px", backgroundColor: `${textColor}33` }} />
                <div className="flex flex-col items-center text-center mt-0.5">
                  <div className="text-[8px] font-medium leading-snug">{rewardName || (isArabic ? "تدرب وادخر" : "Train & Save")}</div>
                  <div className="text-[6px] font-light leading-snug opacity-90">{cardDescription || (isArabic ? "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!" : "Enjoy our premium facilities and earn exclusive rewards!")}</div>
                </div>
                <div className="flex-grow" />
                <div className="flex items-center justify-center -mt-1.5">
                  <div className="rounded-lg p-1" style={{ backgroundColor: "#ffffff" }}>
                    <svg className="w-[44px] h-[44px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" style={{ stroke: cardBg }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between pt-1 border-t" style={{ borderColor: `${textColor}33` }}>
                  <div className="text-center flex-1"><div className="text-[4px] font-extralight opacity-80">{isArabic ? "رقم العضوية" : "Member ID"}</div><div className="text-[5px] font-medium truncate">183-720-764-861</div></div>
                  <div className="text-center flex-1"><div className="text-[4px] font-extralight opacity-80">{isArabic ? "المصدر" : "Issuer"}</div><div className="text-[5px] font-medium">{isArabic ? "29 يوليو 2026" : "July 29, 2026"}</div></div>
                  <div className="text-center flex-1"><div className="text-[4px] font-extralight opacity-80">{isArabic ? "الانتهاء" : "Expiry"}</div><div className="text-[5px] font-medium">{isArabic ? "29 يوليو 2027" : "July 29, 2027"}</div></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
            <p className="text-[9px] text-gray-400">preview</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-[#e5e7eb] rounded-xl bg-white shadow-sm w-[380px]" dir={dir}>
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5 border-b border-[#e5e7eb]">
            <div>
              <div className="text-[13px] font-bold text-gray-800">{(isArabic ? "تعديل البطاقة" : "Edit Card")}</div>
              <div className="text-[10px] text-gray-500">{id ? `${(isArabic ? "رقم البطاقة" : "Card ID")}: ${id}` : (isArabic ? "بطاقة جديدة" : "New Card")}</div>
            </div>
          </div>
          <div className="flex border-b border-[#e5e7eb] px-2 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1 px-2.5 py-2 text-[10px] font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-[#7c88c4] text-[#7c88c4]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {isArabic ? tab.labelAr : tab.labelEn}
                </button>
              ))}
          </div>

          {activeTab === "details" && (
          <div className="p-3 space-y-2.5" dir={dir}>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الاسم" : "Name")}</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الوصف" : "Description")}</label>
              <textarea rows={2} value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} placeholder={(isArabic ? "مثل قهوة مجانية أو غسيل سيارة مجاني أو خصم 15% أو قسيمة بقيمة 10$" : "e.g. Free coffee, free car wash, 15% off, or a \$10 voucher")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "نوع المكافأة" : "Reward Type")}</label>
              <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs bg-white">
                <option value="coupon">{(isArabic ? "قسيمة شراء" : "Coupon")}</option>
                <option value="stamps">{(isArabic ? "طوابع" : "Stamps")}</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "النقاط المطلوبة للحصول على المكافأة" : "Points Required")}</label>
              <input type="number" min={1} max={100} value={pointsRequired} onChange={(e) => setPointsRequired(Math.max(1, Number(e.target.value) || 1))} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "اسم المكافأة" : "Reward Name")}</label>
              <input type="text" value={rewardName} onChange={(e) => setRewardName(e.target.value)} placeholder={(isArabic ? "مثل قهوة مجانية، خصم 15%" : "e.g. Free coffee, 15% off")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
            </div>
            <button onClick={goToNextTab} className="w-full py-2 rounded-lg bg-[#7c88c4] text-white font-semibold text-xs hover:bg-[#5a68b0] transition-colors flex items-center justify-center gap-1.5">
              {(isArabic ? "التالي ←" : "Next →")}
            </button>
          </div>
          )}

          {activeTab === "design" && (
          <div className="p-3 space-y-2.5" dir={dir}>
            {uploadFields.map((field, i) => (
              <div key={i} className="border border-dashed border-[#dde1ee] rounded-lg p-2.5">
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{isArabic ? field.labelAr : field.labelEn}</label>
                <p className="text-[9px] text-gray-400 mb-2">{field.hint}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-lg border border-dashed border-[#dde1ee] bg-[#fafbff] flex items-center justify-center overflow-hidden">
                    {images[i] ? (
                      <img src={images[i]} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-[10px] px-2.5 py-1 rounded-lg border border-[#dde1ee] text-gray-600 hover:bg-[#f7f9ff] transition-colors font-medium">
                      {field.btn}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setImages(prev => { const next = [...prev]; next[i] = url; return next; });
                      }
                    }} />
                  </label>
                </div>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">{(isArabic ? "الألوان" : "Colors")}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <input type="color" value={cardBg} onChange={(e) => setCardBg(e.target.value)} className="w-7 h-7 rounded-full border-2 border-[#dde1ee] cursor-pointer p-0" />
                  <span className="text-[10px] text-gray-600 font-medium">{(isArabic ? "لون خلفية البطاقة" : "Card Background")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input type="color" value={barBg} onChange={(e) => setBarBg(e.target.value)} className="w-7 h-7 rounded-full border-2 border-[#dde1ee] cursor-pointer p-0" />
                  <span className="text-[10px] text-gray-600 font-medium">{(isArabic ? "لون خلفية الشريط" : "Bar Background")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-7 h-7 rounded-full border-2 border-[#dde1ee] cursor-pointer p-0" />
                  <span className="text-[10px] text-gray-600 font-medium">{(isArabic ? "لون نص البطاقة" : "Text Color")}</span>
                </div>
              </div>
            </div>
            <button onClick={goToNextTab} className="w-full py-2 rounded-lg bg-[#7c88c4] text-white font-semibold text-xs hover:bg-[#5a68b0] transition-colors flex items-center justify-center gap-1.5">
              {(isArabic ? "التالي ←" : "Next →")}
            </button>
          </div>
          )}

          {activeTab === "links" && (
          <div className="p-3 space-y-2.5" dir={dir}>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الاسم" : "Name")}</label>
                <input type="text" value={linkName} onChange={(e) => setLinkName(e.target.value)} placeholder={(isArabic ? "الاسم" : "Name")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الرابط" : "URL")}</label>
                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
              </div>
              <button onClick={handleAddLink} className="w-full py-2 rounded-lg border border-[#dde1ee] text-[#7c88c4] font-semibold text-xs hover:bg-[#f7f9ff] transition-colors flex items-center justify-center gap-1.5">
                {(isArabic ? "إضافة رابط" : "Add Link")}
              </button>
            </div>
            {links.length > 0 && (
              <div className="space-y-1">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#f7f9ff] rounded-lg px-2.5 py-1.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-[#111111]">{link.name}</span>
                      <span className="text-[9px] text-[#5f6678] truncate max-w-[250px]">{link.url}</span>
                    </div>
                    <button onClick={() => setLinks(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={goToNextTab} className="w-full py-2 rounded-lg bg-[#7c88c4] text-white font-semibold text-xs hover:bg-[#5a68b0] transition-colors flex items-center justify-center gap-1.5">
              {(isArabic ? "التالي ←" : "Next →")}
            </button>
          </div>
          )}

          {activeTab === "locations" && (
          <div className="p-3 space-y-2.5" dir={dir}>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7c88c4]" />
              <span className="text-[11px] font-semibold text-gray-700">{(isArabic ? "إضافة موقع جديد" : "Add New Location")}</span>
            </div>
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الاسم" : "Name")} *</label>
                <input type="text" value={locName} onChange={(e) => setLocName(e.target.value)} placeholder={(isArabic ? "اسم الموقع" : "Location name")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "ابحث باستخدام اسم المتجر" : "Search by store name")}</label>
                <input type="text" placeholder={(isArabic ? "اسم المتجر..." : "Store name...")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الموقع" : "Location")} *</label>
                <p className="text-[10px] text-gray-400 mb-1">{(isArabic ? "انقر على الخريطة لتحديد الموقع" : "Click on the map to pin")}</p>
                <div ref={mapRef} className="w-full h-28 rounded-lg border border-[#dde1ee] z-0" style={{ cursor: 'crosshair' }} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "وصف الموقع" : "Location Description")}</label>
                <input type="text" value={locAddress} onChange={(e) => setLocAddress(e.target.value)} placeholder={(isArabic ? "اكتب العنوان هنا" : "Write the address here")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">{(isArabic ? "الإشعار التلقائي" : "Auto Notification")}</label>
                <textarea rows={2} value={locNotification} onChange={(e) => setLocNotification(e.target.value)} placeholder={(isArabic ? "الإشعار عند الاقتراب من الموقع" : "Notification when near this location")} className="w-full px-3 py-2 rounded-lg border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs resize-none" />
              </div>
              <button onClick={handleAddLocation} className="w-full py-2 rounded-lg border border-[#dde1ee] text-[#7c88c4] font-semibold text-xs hover:bg-[#f7f9ff] transition-colors flex items-center justify-center gap-1.5">
                {(isArabic ? "إضافة موقع" : "Add Location")}
              </button>
            </div>
            {locations.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-gray-500">{(isArabic ? "المواقع المضافة" : "Added Locations")} ({locations.length})</div>
                {locations.map((loc, i) => (
                  <div key={i} className="flex items-start justify-between bg-[#f7f9ff] rounded-lg px-2.5 py-1.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-[#111111]">{loc.name}</span>
                      <span className="text-[9px] text-[#5f6678]">{loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}</span>
                      {loc.notification && <span className="text-[8px] text-[#7c88c4] mt-0.5 line-clamp-1">{loc.notification}</span>}
                    </div>
                    <button onClick={() => setLocations(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleSave} className="w-full py-2 rounded-lg bg-[#7c88c4] text-white font-semibold text-xs hover:bg-[#5a68b0] transition-colors flex items-center justify-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              {(isArabic ? "حفظ التغييرات" : "Save Changes")}
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}