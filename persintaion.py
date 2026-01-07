#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Electronic Academy - ULTIMATE Presentation Generator
A comprehensive, professional, and visually stunning presentation in Arabic.
Covers: System Overview, Scenarios, Functional/Non-functional Requirements.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
import datetime

# --- Theme Configuration ---
COLOR_PRIMARY = RGBColor(10, 31, 59)     # Midnight Blue
COLOR_SECONDARY = RGBColor(199, 160, 97) # Elegant Gold
COLOR_ACCENT = RGBColor(41, 128, 185)    # Bright Accent Blue
COLOR_BG_LIGHT = RGBColor(245, 247, 250) # Very Light Gray
COLOR_TEXT_DARK = RGBColor(44, 62, 80)
COLOR_WHITE = RGBColor(255, 255, 255)

class UltimatePresentation:
    def __init__(self):
        self.prs = Presentation()
        self.prs.slide_width = Inches(13.333) # Widescreen 16:9
        self.prs.slide_height = Inches(7.5)
        
    def _add_modern_background(self, slide, dark=False):
        """Adds modern geometric background elements"""
        if dark:
            # Full Dark Background
            bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, self.prs.slide_width, self.prs.slide_height)
            bg.fill.solid()
            bg.fill.fore_color.rgb = COLOR_PRIMARY
            bg.line.visible = False
        else:
            # Clean light background with accent header
            bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, self.prs.slide_width, self.prs.slide_height)
            bg.fill.solid()
            bg.fill.fore_color.rgb = COLOR_BG_LIGHT
            bg.line.visible = False
            
            # Top Bar
            header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, self.prs.slide_width, Inches(0.9))
            header.fill.solid()
            header.fill.fore_color.rgb = COLOR_PRIMARY
            header.line.visible = False
            
            # Bottom Gold Bar
            footer = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.4), self.prs.slide_width, Inches(0.1))
            footer.fill.solid()
            footer.fill.fore_color.rgb = COLOR_SECONDARY
            footer.line.visible = False

    def add_title_slide(self):
        slide = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        self._add_modern_background(slide, dark=True)
        
        # Decorative Shape
        shape = slide.shapes.add_shape(MSO_SHAPE.CHEVRON, Inches(1), Inches(2), Inches(11), Inches(3.5))
        shape.fill.solid()
        shape.fill.fore_color.rgb = COLOR_SECONDARY
        shape.fill.transparency = 0.9
        shape.line.visible = False

        # Title
        tx = slide.shapes.add_textbox(Inches(1), Inches(2.2), Inches(11.3), Inches(1.5))
        p = tx.text_frame.paragraphs[0]
        p.text = "منصة الأكاديمية الإلكترونية"
        p.font.size = Pt(66)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.CENTER
        
        # Subtitle
        tx2 = slide.shapes.add_textbox(Inches(1), Inches(3.8), Inches(11.3), Inches(1))
        p2 = tx2.text_frame.paragraphs[0]
        p2.text = "التوثيق الشامل للنظام: المتطلبات، السيناريوهات، والمعمارية التقنية"
        p2.font.size = Pt(32)
        p2.font.color.rgb = COLOR_SECONDARY
        p2.alignment = PP_ALIGN.CENTER

    def add_agenda_slide(self, items):
        slide = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        self._add_modern_background(slide)
        
        # Title
        title_box = slide.shapes.add_textbox(Inches(1), Inches(0), Inches(11.3), Inches(0.9))
        p = title_box.text_frame.paragraphs[0]
        p.text = "أجندة العرض التقديمي"
        p.font.size = Pt(36)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.RIGHT
        
        # Items
        for i, item in enumerate(items):
            box = slide.shapes.add_textbox(Inches(2), Inches(1.5 + (i * 0.7)), Inches(9), Inches(0.6))
            p_item = box.text_frame.paragraphs[0]
            p_item.text = f"• {item}"
            p_item.font.size = Pt(24)
            p_item.font.color.rgb = COLOR_TEXT_DARK
            p_item.alignment = PP_ALIGN.RIGHT

    def add_section_header(self, title):
        slide = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        self._add_modern_background(slide, dark=True)
        
        tx = slide.shapes.add_textbox(Inches(1), Inches(3), Inches(11.3), Inches(1.5))
        p = tx.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(60)
        p.font.bold = True
        p.font.color.rgb = COLOR_SECONDARY
        p.alignment = PP_ALIGN.CENTER

    def add_content_slide(self, title, content_list, icon=None):
        slide = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        self._add_modern_background(slide)
        
        title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0), Inches(12), Inches(0.9))
        tf = title_box.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(36)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.RIGHT
        
        for i, text in enumerate(content_list):
            box = slide.shapes.add_textbox(Inches(1), Inches(1.5 + (i * 0.65)), Inches(11), Inches(0.6))
            p_text = box.text_frame.paragraphs[0]
            # Handle RTL bullet manually for better look
            p_text.text = f"{text} ←" 
            p_text.font.size = Pt(22)
            p_text.font.color.rgb = COLOR_TEXT_DARK
            p_text.alignment = PP_ALIGN.RIGHT

    def add_two_column_slide(self, title, left_title, left_bullets, right_title, right_bullets):
        slide = self.prs.slides.add_slide(self.prs.slide_layouts[6])
        self._add_modern_background(slide)
        
        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0), Inches(12), Inches(0.9))
        p_main = title_box.text_frame.paragraphs[0]
        p_main.text = title
        p_main.font.size = Pt(36)
        p_main.font.bold = True
        p_main.font.color.rgb = COLOR_WHITE
        p_main.alignment = PP_ALIGN.RIGHT

        # Left Box (Functional for example)
        l_title_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(6), Inches(0.6))
        p_l = l_title_box.text_frame.paragraphs[0]
        p_l.text = left_title
        p_l.font.size = Pt(26)
        p_l.font.bold = True
        p_l.font.color.rgb = COLOR_ACCENT
        p_l.alignment = PP_ALIGN.RIGHT
        
        for i, b in enumerate(left_bullets):
            p = l_title_box.text_frame.add_paragraph()
            p.text = f"{b} •"
            p.font.size = Pt(18)
            p.alignment = PP_ALIGN.RIGHT

        # Right Box
        r_title_box = slide.shapes.add_textbox(Inches(6.8), Inches(1.3), Inches(6), Inches(0.6))
        p_r = r_title_box.text_frame.paragraphs[0]
        p_r.text = right_title
        p_r.font.size = Pt(26)
        p_r.font.bold = True
        p_r.font.color.rgb = COLOR_ACCENT
        p_r.alignment = PP_ALIGN.RIGHT
        
        for i, b in enumerate(right_bullets):
            p = r_title_box.text_frame.add_paragraph()
            p.text = f"{b} •"
            p.font.size = Pt(18)
            p.alignment = PP_ALIGN.RIGHT

    def save(self, filename):
        self.prs.save(filename)

# --- Content Generation ---
def generate_ultimate_presentation():
    up = UltimatePresentation()
    
    # 1. Title
    up.add_title_slide()
    
    # 2. Agenda
    up.add_agenda_slide([
        "الرؤية العامة للمنصة",
        "المتطلبات الوظيفية (Functional)",
        "المتطلبات غير الوظيفية (Non-Functional)",
        "سيناريوهات الاستخدام التفصيلية",
        "البنية التحتية والتقنيات",
        "الخريطة المستقبلية"
    ])
    
    # --- Section: Whole System ---
    up.add_section_header("الرؤية والوصف الشامل للنظام")
    up.add_content_slide("ما هي الأكاديمية الإلكترونية؟", [
        "منصة تعليمية متكاملة تهدف إلى رقمنة العملية التعليمية برمتها",
        "نظام يربط بين أطراف العملية (طالب، معلم، إداري) في بيئة سحابية واحدة",
        "حل ذكي لإدارة المحتوى التعليمي والدروس التفاعلية",
        "نظام مالي مدمج لتسهيل عمليات البيع والشراء والاشتراكات"
    ])
    
    # --- Section: Functional Requirements ---
    up.add_section_header("المتطلبات الوظيفية (Functional)")
    
    up.add_content_slide("1. إدارة الهوية والصلاحيات", [
        "إمكانية إنشاء حسابات جديدة (طلاب ومعلمين)",
        "نظام تسجيل دخول آمن باستخدام بروتوكول JWT",
        "تعدد رتب المستخدمين (Student, Teacher, Admin, Super Admin)",
        "إدارة الملف الشخصي والتحقق من البريد الإلكتروني"
    ])
    
    up.add_content_slide("2. إدارة المحتوى التعليمي", [
        "إنشاء وتعديل الدورات التدريبية (للمعلمين)",
        "رفع فيديوهات الدروس وإضافة المحتوى النصي",
        "إضافة ملحقات ووثائق تكميلية للدروس",
        "تنظيم الدورات ضمن تصنيفات ومسارات تعليمية محددة"
    ])
    
    up.add_content_slide("3. النظام المالي والمحفظة", [
        "توفير محفظة إلكترونية لكل مستخدم (Wallet System)",
        "إمكانية شحن الرصيد عبر بوابات الدفع الإلكترونية",
        "خصم تلقائي من الرصيد عند شراء الدورات",
        "تتبع كامل لسجل العمليات المالية (Transactions History)",
        "نظام محاكاة الدفع للتأكد من سلامة العمليات"
    ])
    
    up.add_content_slide("4. التقييم والاختبارات", [
        "إنشاء اختبارات تفاعلية لكل درس",
        "دعم أنواع متعددة من الأسئلة (Multiple Choice, True/False)",
        "تصحيح تلقائي للإجابات وتقديم النتيجة فوراً",
        "متابعة سجل نتائج الطلاب وتحديد حالة النجاح والرسوب"
    ])

    up.add_content_slide("5. التواصل والتعليقات", [
        "نظام تعليقات مرن أسفل كل درس للنقاش",
        "إمكانية الرد على التعليقات (Threaded Comments)",
        "تمييز تعليقات المعلمين لتقديم الإرشاد الأكاديمي",
        "لوحة تحكم للمعلم لمتابعة كافة الاستفسارات الواردة"
    ])

    # --- Section: Non-Functional Requirements ---
    up.add_section_header("المتطلبات غير الوظيفية (Non-Functional)")
    
    up.add_two_column_slide(
        "الأداء والأمان",
        "الأداء (Performance)",
        ["سرعة تحميل الصفحات أقل من 2 ثانية", "دعم عدد كبير من المستخدمين المتزامنين", "تحميل الفيديوهات بسلاسة Dynamic Streaming"],
        "الأمان (Security)",
        ["تشفير بيانات المستخدمين (End-to-End)", "حماية من هجمات XSS و SQL Injection", "تحديث دوري لـ Tokens للمصادقة"]
    )
    
    up.add_two_column_slide(
        "سهولة الاستخدام والتوافق",
        "تجربة المستخدم (UX)",
        ["واجهة بسيطة تدعم العربية بشكل طبيعي RTL", "ألوان مريحة للعين وتصميم عصري", "سهولة التنقل بين الأقسام بضغطة واحدة"],
        "التوافقية (Compatibility)",
        ["متجاوب تماماً مع الهواتف الذكية", "متوافق مع كافة المتصفحات الحديثة", "يدعم مختلف أحجام الشاشات (Desktop, Tablet)"]
    )

    # --- Section: User Scenarios ---
    up.add_section_header("سيناريوهات الاستخدام (User Scenarios)")
    
    up.add_content_slide("السيناريو 1: رحلة الطالب (Student Path)", [
        "يسجل الطالب حساباً جديداً ويقوم بشحن محفظته",
        "يتصفح المسارات التعليمية ويختار دورتين ويضيفهما للسلة",
        "يتمم الشراء ويبدأ بمشاهدة الفيديوهات وتسجيل الملاحظات",
        "يحل الاختبارات، ينجح، ويتابع نسبة تقدمه حتى 100%"
    ])
    
    up.add_content_slide("السيناريو 2: رحلة المعلم (Teacher Path)", [
        "يقوم المعلم بإنشاء دورة جديدة ورفع 10 دروس فيديو",
        "يضع 5 أسئلة لكل درس لتقييم فهم الطلاب",
        "يتابع تعليقات الطلاب ويرد على استفساراتهم التقنية",
        "يحلل إحصائيات المبيعات وأداء الطلاب في الاختبارات"
    ])
    
    up.add_content_slide("السيناريو 3: رحلة المسؤول (Admin Path)", [
        "يقوم المسؤول بتغيير صور الواجهة (Sliders) لعرض عرض جديد",
        "يضيف مسار تعليمي جديد (مثلاً: الذكاء الاصطناعي)",
        "يراجع إعلانات الوظائف ويحدث معلومات تواصل المؤسسة",
        "يراقب الإيرادات الكلية ونمو قاعدة البيانات"
    ])

    # --- Section: Technical Stack ---
    up.add_section_header("البنية التحتية والتقنيات (Tech Stack)")
    
    up.add_content_slide("تكنولوجيات الواجهة (Frontend)", [
        "Next.js 14 كإطار عمل أساسي (App Router)",
        "React.js لبناء الواجهات التفاعلية",
        "Tailwind CSS للتصميم المتجاوب والسريع",
        "Zustand لإدارة الحالة العامة للتطبيق (State Management)"
    ])
    
    up.add_content_slide("تكنولوجيات الخلفية والربط (Backend & API)", [
        "Server Actions لربط الواجهة بالبيانات بشكل مباشر",
        "RESTful API للتعامل مع العمليات المعقدة",
        "JWT للمصادقة وتأمين الجلسات",
        "PostgreSQL لإدارة قواعد البيانات العلائقية"
    ])

    # --- Conclusion ---
    up.add_section_header("الخريطة المستقبلية والخاتمة")
    
    up.add_content_slide("تطويرات قادمة", [
        "إطلاق تطبيقات الهواتف الذكية (Native Mobile Apps)",
        "دعم البث المباشر (Live Classes) مع المعلمين",
        "نظام إصدار شهادات رقمية موثقة بتقنية Blockchain",
        "إدخال الذكاء الاصطناعي لتخصيص مسار التعلم لكل طالب"
    ])
    
    up.add_title_slide() # Re-add title at end as "Thank You"
    
    # Save
    out_file = "عرض_تقديمي_شامل_الأكاديمية.pptx"
    up.save(out_file)
    print(f"✅ تم إنشاء العرض التقديمي النهائي بنجاح: {out_file}")

if __name__ == "__main__":
    print("🚀 جاري البدء في إنشاء العرض التقديمي الأكبر والأكثر احترافية...")
    generate_ultimate_presentation()
    print("✨ تم الانتهاء بنجاح! الملف جاهز للاستخدام.")
