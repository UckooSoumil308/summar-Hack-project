import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal, ShieldCheck, Cpu, Database, ChevronRight, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-orange-500/30 overflow-x-hidden">

      {/* Global Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 text-zinc-100 font-bold font-mono tracking-widest text-sm">
          <Terminal className="w-6 h-6 text-orange-500" />
          <span className="uppercase">XAI_Recruit</span>
        </div>
        <div className="flex items-center space-x-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <span className="hidden md:inline-block border border-emerald-400/30 px-2 py-1 text-emerald-400 bg-emerald-400/10">v1.0.0_BETA</span>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#architecture" className="hover:text-orange-500 transition-colors">Architecture</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center pt-20 px-4 md:px-8 border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.png"
            alt="Cyber Industrial Matrix"
            className="w-full h-full object-cover opacity-20 mix-blend-screen filter grayscale-[20%] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950"></div>
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-30"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 rounded-none backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-400 rounded-none animate-pulse mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">Agentic Telemetry Online</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-100 tracking-tighter uppercase leading-[0.9] mb-8">
            Filter Talent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">Without Bias.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-2xl text-lg md:text-xl text-zinc-400 font-mono leading-relaxed mb-12">
            XAI_Recruit deploys multi-agent neural pipelines to extract, empirically verify, and synthesize candidate profiles. No resumes. Just pure telemetry.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <button
              onClick={() => navigate('/apply')}
              className="group relative px-8 py-4 bg-orange-500 text-zinc-950 font-bold font-mono text-sm uppercase tracking-widest overflow-hidden border border-transparent hover:border-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center">
                Candidate Portal <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 bg-zinc-900 text-zinc-300 font-bold font-mono text-sm uppercase tracking-widest overflow-hidden border border-zinc-700 hover:border-emerald-400 hover:text-emerald-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute inset-0 bg-emerald-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center">
                Recruiter Workspace <Activity className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-zinc-100 mb-2">Core Directives</h2>
          <div className="w-24 h-1 bg-orange-500"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu className="w-8 h-8 text-orange-500" />,
              title: "Neural Extraction",
              desc: "Deploy Qwen 7B agents to aggressively parse unstructured PDF data into clean JSON schemas, bypassing traditional ATS regex failures."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
              title: "Empirical Verification",
              desc: "Every claimed technology is cross-referenced against public Open Source repositories, establishing a strict Proof-of-Work matrix."
            },
            {
              icon: <Database className="w-8 h-8 text-zinc-400" />,
              title: "AI Inquisitor Playbook",
              desc: "Our 72B Synthesizer auto-generates custom, highly technical interrogation questions specifically targeting unverified candidate claims."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2 }}
              className="bg-zinc-900 border border-zinc-800 p-8 hover:border-zinc-600 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-zinc-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-6 p-4 bg-zinc-950 inline-block border border-zinc-800 group-hover:border-orange-500/50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest text-zinc-100 mb-4 font-mono">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed font-sans">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simulated Terminal */}
      <section id="architecture" className="py-24 px-4 md:px-8 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden rounded-none">
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-none border border-red-500/50 bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-none border border-orange-500/50 bg-orange-500/20"></div>
                <div className="w-3 h-3 rounded-none border border-emerald-500/50 bg-emerald-500/20"></div>
              </div>
              <div className="mx-auto font-mono text-[10px] uppercase tracking-widest text-zinc-600">pipeline_execution_log.sh</div>
            </div>
            {/* Terminal Body */}
            <div className="p-6 md:p-10 font-mono text-xs md:text-sm text-zinc-400 space-y-4 relative z-10">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <span className="text-emerald-400">sysadmin@xai-core:~$</span> ./xai_recruit_pipeline --target candidate.pdf
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <span className="text-zinc-500">[10:04:12]</span> [PROCESSING] Initiating PDF binary extraction sequence...
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.0 }}>
                <span className="text-zinc-500">[10:04:13]</span> [CONNECTING] Agent 1 (Qwen-7B) analyzing structural entities...
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>
                <span className="text-zinc-500">[10:04:14]</span> [ANALYZING] Empirical verification sequence triggered. Cross-referencing GitHub telemetry...
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.2 }}>
                <span className="text-orange-500 font-bold">[10:04:15] [WARN] 2 skills flagged as "Unverified". Building AI interrogation playbook...</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.0 }}>
                <span className="text-zinc-500">[10:04:17]</span> [SYNTHESIZING] Agent 2 (Qwen-72B) generating day-1 readiness matrix...
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.5 }}>
                <span className="text-emerald-400 font-bold">[10:04:18] [SUCCESS]</span> Neural traces persisted to Cluster. Candidate record locked.
              </motion.div>
              <div className="mt-6 text-orange-500 animate-pulse font-bold text-lg">_</div>
            </div>
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-20"></div>
          </div>
        </div>
      </section>


    </div>
  );
}
