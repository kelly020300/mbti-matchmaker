import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  User, 
  Users, 
  ArrowRight, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getMBTICompatibility, CompatibilityResult } from "@/src/services/geminiService";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const GENDERS = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "기타" }
];

export default function App() {
  const [myMBTI, setMyMBTI] = useState<string>("");
  const [myGender, setMyGender] = useState<string>("");
  const [partnerMBTI, setPartnerMBTI] = useState<string>("");
  const [partnerGender, setPartnerGender] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!myMBTI || !myGender || !partnerMBTI || !partnerGender) {
      setError("모든 정보를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getMBTICompatibility(myMBTI, myGender, partnerMBTI, partnerGender);
      setResult(data);
    } catch (err) {
      setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMyMBTI("");
    setMyGender("");
    setPartnerMBTI("");
    setPartnerGender("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-pink-100 selection:text-pink-600">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold mb-4 border border-pink-100"
        >
          <Sparkles className="w-3 h-3" />
          AI 기반 MBTI 궁합 분석
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
        >
          MBTI <span className="text-pink-500">Matchmaker</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-md mx-auto"
        >
          당신과 상대방의 MBTI와 성별을 입력하고 AI가 분석하는 특별한 궁합을 확인해보세요.
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* My Info */}
              <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">나의 정보</span>
                  </div>
                  <CardTitle>본인</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="my-mbti">MBTI 유형</Label>
                    <Select onValueChange={setMyMBTI} value={myMBTI}>
                      <SelectTrigger id="my-mbti" className="h-12">
                        <SelectValue placeholder="MBTI 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {MBTI_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="my-gender">성별</Label>
                    <Select onValueChange={setMyGender} value={myGender}>
                      <SelectTrigger id="my-gender" className="h-12">
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map(gender => (
                          <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Partner Info */}
              <Card className="border-none shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-pink-50 to-rose-50 border-b border-pink-100/50">
                  <div className="flex items-center gap-2 text-pink-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">상대방 정보</span>
                  </div>
                  <CardTitle>상대방</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-mbti">MBTI 유형</Label>
                    <Select onValueChange={setPartnerMBTI} value={partnerMBTI}>
                      <SelectTrigger id="partner-mbti" className="h-12">
                        <SelectValue placeholder="MBTI 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {MBTI_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-gender">성별</Label>
                    <Select onValueChange={setPartnerGender} value={partnerGender}>
                      <SelectTrigger id="partner-gender" className="h-12">
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map(gender => (
                          <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 flex flex-col items-center gap-4 mt-4">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 px-4 py-2 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
                <Button 
                  onClick={handleCheck}
                  disabled={loading}
                  className="w-full md:w-64 h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-200"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      궁합 확인하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Score Display */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-100"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={552.92}
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 552.92 - (552.92 * result.score) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-pink-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-pink-600">{result.score}</span>
                    <span className="text-sm font-bold text-pink-400 uppercase tracking-widest">점</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4 items-center">
                  <Badge variant="outline" className="text-lg py-1 px-4 border-blue-200 bg-blue-50 text-blue-700">
                    {myMBTI}
                  </Badge>
                  <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
                  <Badge variant="outline" className="text-lg py-1 px-4 border-pink-200 bg-pink-50 text-pink-700">
                    {partnerMBTI}
                  </Badge>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-xl shadow-gray-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      AI 분석 요약
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {result.summary}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-bold text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          주요 강점
                        </h4>
                        <ul className="space-y-2">
                          {result.strengths.map((s, i) => (i < 3 && (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                              {s}
                            </li>
                          )))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-amber-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          주의할 점
                        </h4>
                        <ul className="space-y-2">
                          {result.challenges.map((c, i) => (i < 3 && (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {c}
                            </li>
                          )))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-gray-200/50 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Info className="w-5 h-5" />
                      관계 조언
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed opacity-90">
                      {result.advice}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="secondary" 
                      className="w-full bg-white/10 hover:bg-white/20 border-none text-white font-bold"
                      onClick={handleReset}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      다시 테스트하기
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-muted-foreground text-sm border-t border-gray-100">
        <p>© 2026 MBTI Matchmaker. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
}
