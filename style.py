"""
Professional Mobile-Style Finance Tracker UI
Replicates the CSS design with professional Python frontend using Tkinter
"""

import tkinter as tk
from tkinter import ttk
import tkinter.font as tkFont
from datetime import datetime
import threading
from typing import List, Callable, Optional
from dataclasses import dataclass
from enum import Enum


# ======================== CONSTANTS & ENUMS ========================

class Colors:
    """Professional color palette"""
    PRIMARY_DARK = "#1e1e1e"
    PRIMARY_DARKER = "#121212"
    ACCENT_RED = "#e74c3c"
    ACCENT_GREEN = "#27ae60"
    TEXT_DARK = "#333333"
    TEXT_LIGHT = "#888888"
    BORDER_LIGHT = "#dddddd"
    BG_LIGHT = "#f9f9f9"
    BG_LIGHTER = "#f1f1f1"
    WHITE = "#ffffff"
    BLACK = "#000000"
    ERROR_BG = "#ffebeb"
    ERROR_TEXT = "#ff4b4b"


class FontSizes:
    """Typography scale"""
    HEADER_TITLE = 24
    HEADER_SUBTITLE = 12
    CARD_TITLE = 12
    CARD_VALUE = 40
    BUTTON_TEXT = 11
    LIST_ITEM = 13
    FOOTER_TEXT = 13


@dataclass
class ListItem:
    """Data model for list items"""
    id: str
    title: str
    amount: float
    is_income: bool
    timestamp: str


# ======================== CUSTOM WIDGETS ========================

class SplashScreen(tk.Toplevel):
    """Professional splash screen with logo and loader animation"""
    
    def __init__(self, parent, duration: int = 2000):
        super().__init__(parent)
        self.duration = duration
        self.setup_window()
        self.create_widgets()
        self.animate_loader()
        
    def setup_window(self):
        """Configure splash screen window"""
        self.geometry("420x600")
        self.config(bg=Colors.BLACK)
        self.overrideredirect(True)
        
        # Center window on screen
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f"{width}x{height}+{x}+{y}")
    
    def create_widgets(self):
        """Create splash screen widgets"""
        main_frame = tk.Frame(self, bg=Colors.BLACK)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Logo placeholder
        logo_frame = tk.Frame(main_frame, bg=Colors.BLACK, width=120, height=120)
        logo_frame.pack(pady=30)
        
        logo_label = tk.Label(
            logo_frame,
            text="💰",
            font=("Arial", 60),
            bg=Colors.BLACK,
            fg=Colors.WHITE
        )
        logo_label.pack()
        
        # App title
        title_font = tkFont.Font(family="Segoe UI", size=22, weight="bold")
        title_label = tk.Label(
            main_frame,
            text="FinanceTracker",
            font=title_font,
            bg=Colors.BLACK,
            fg=Colors.WHITE
        )
        title_label.pack(pady=20)
        
        # Loader
        self.loader_frame = tk.Frame(main_frame, bg=Colors.BLACK, width=30, height=30)
        self.loader_frame.pack(pady=30)
        
        self.canvas = tk.Canvas(
            self.loader_frame,
            width=30,
            height=30,
            bg=Colors.BLACK,
            highlightthickness=0
        )
        self.canvas.pack()
        
        # Schedule close
        self.after(self.duration, self.destroy)
    
    def animate_loader(self):
        """Animate loading spinner"""
        self.rotation = 0
        self.update_loader()
    
    def update_loader(self):
        """Update loader animation"""
        if self.winfo_exists():
            self.canvas.delete("all")
            self.rotation = (self.rotation + 20) % 360
            
            # Draw spinning circle
            arc = self.canvas.create_arc(
                2, 2, 28, 28,
                start=self.rotation,
                extent=90,
                outline=Colors.WHITE,
                width=3
            )
            self.after(50, self.update_loader)


class BalanceCard(tk.Frame):
    """Professional balance display card"""
    
    def __init__(self, parent, balance: float = 0.0, currency: str = "$"):
        super().__init__(parent)
        self.balance = balance
        self.currency = currency
        self.setup_styles()
        self.create_widgets()
    
    def setup_styles(self):
        """Setup card styling"""
        self.config(
            bg=Colors.WHITE,
            relief=tk.FLAT,
            highlightthickness=0
        )
    
    def create_widgets(self):
        """Create card widgets"""
        # Gradient background simulation with Frame
        bg_frame = tk.Frame(
            self,
            bg=Colors.PRIMARY_DARK,
            height=200
        )
        bg_frame.pack(fill=tk.BOTH, padx=20, pady=20)
        bg_frame.pack_propagate(False)
        
        # Inner content frame
        content_frame = tk.Frame(bg_frame, bg=Colors.PRIMARY_DARK)
        content_frame.pack(fill=tk.BOTH, expand=True, padx=25, pady=25)
        
        # Label
        label_font = tkFont.Font(family="Segoe UI", size=11)
        label = tk.Label(
            content_frame,
            text="BALANCE",
            font=label_font,
            bg=Colors.PRIMARY_DARK,
            fg=Colors.WHITE,
            pady=10
        )
        label.pack()
        
        # Amount
        amount_font = tkFont.Font(family="Segoe UI", size=40, weight="bold")
        amount = tk.Label(
            content_frame,
            text=f"{self.currency}{self.balance:,.2f}",
            font=amount_font,
            bg=Colors.PRIMARY_DARK,
            fg=Colors.WHITE
        )
        amount.pack(pady=10)
    
    def update_balance(self, new_balance: float):
        """Update displayed balance"""
        self.balance = new_balance
        for widget in self.winfo_children():
            widget.destroy()
        self.create_widgets()


class MicButton(tk.Frame):
    """Professional microphone button with pulse animation"""
    
    def __init__(self, parent, on_click: Callable = None):
        super().__init__(parent, bg=Colors.WHITE)
        self.on_click = on_click
        self.is_listening = False
        self.pulse_step = 0
        self.create_button()
    
    def create_button(self):
        """Create microphone button"""
        button_frame = tk.Frame(self, bg=Colors.WHITE)
        button_frame.pack(pady=20)
        
        self.button = tk.Button(
            button_frame,
            text="🎤",
            font=("Arial", 28),
            width=5,
            height=2,
            bg=Colors.BLACK,
            fg=Colors.WHITE,
            activebackground=Colors.ACCENT_RED,
            activeforeground=Colors.WHITE,
            relief=tk.RAISED,
            bd=0,
            command=self.toggle_listening
        )
        self.button.pack()
        
        # Status text
        status_font = tkFont.Font(family="Segoe UI", size=10)
        self.status_label = tk.Label(
            self,
            text="Press to use voice input",
            font=status_font,
            bg=Colors.WHITE,
            fg=Colors.TEXT_LIGHT
        )
        self.status_label.pack(pady=10)
    
    def toggle_listening(self):
        """Toggle listening state and animate"""
        self.is_listening = not self.is_listening
        
        if self.is_listening:
            self.button.config(bg=Colors.ACCENT_RED)
            self.status_label.config(text="Listening... 🎤", fg=Colors.ACCENT_RED)
            self.animate_pulse()
            if self.on_click:
                threading.Thread(target=self.on_click, daemon=True).start()
        else:
            self.button.config(bg=Colors.BLACK)
            self.status_label.config(text="Press to use voice input", fg=Colors.TEXT_LIGHT)
    
    def animate_pulse(self):
        """Animate pulse effect"""
        if self.is_listening and self.winfo_exists():
            self.pulse_step = (self.pulse_step + 1) % 30
            self.after(50, self.animate_pulse)


class ManualInputBar(tk.Frame):
    """Professional input bar for manual text entry"""
    
    def __init__(self, parent, on_submit: Callable = None):
        super().__init__(parent, bg=Colors.WHITE)
        self.on_submit = on_submit
        self.create_widgets()
    
    def create_widgets(self):
        """Create input widgets"""
        container = tk.Frame(self, bg=Colors.WHITE)
        container.pack(fill=tk.X, padx=20, pady=20)
        
        # Input field
        input_font = tkFont.Font(family="Segoe UI", size=11)
        self.input_field = tk.Entry(
            container,
            font=input_font,
            bg=Colors.WHITE,
            fg=Colors.TEXT_DARK,
            relief=tk.SOLID,
            bd=1,
            insertbackground=Colors.TEXT_DARK
        )
        self.input_field.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        self.input_field.bind("<Return>", self.submit)
        
        # Add button
        button_font = tkFont.Font(family="Segoe UI", size=10, weight="bold")
        add_btn = tk.Button(
            container,
            text="ADD",
            font=button_font,
            bg=Colors.BLACK,
            fg=Colors.WHITE,
            relief=tk.FLAT,
            cursor="hand2",
            command=self.submit,
            padx=20,
            pady=10
        )
        add_btn.pack(side=tk.LEFT)
    
    def submit(self, event=None):
        """Submit input"""
        text = self.input_field.get().strip()
        if text and self.on_submit:
            self.on_submit(text)
            self.input_field.delete(0, tk.END)
    
    def get_value(self) -> str:
        """Get input field value"""
        return self.input_field.get().strip()
    
    def clear(self):
        """Clear input field"""
        self.input_field.delete(0, tk.END)


class TransactionListItem(tk.Frame):
    """Professional transaction list item"""
    
    def __init__(self, parent, item: ListItem, on_delete: Callable = None):
        super().__init__(parent, bg=Colors.BG_LIGHT, relief=tk.FLAT, highlightthickness=0)
        self.item = item
        self.on_delete = on_delete
        self.create_widgets()
    
    def create_widgets(self):
        """Create list item widgets"""
        self.pack(fill=tk.X, padx=20, pady=5)
        
        # Content frame
        content = tk.Frame(self, bg=Colors.BG_LIGHT)
        content.pack(fill=tk.BOTH, expand=True, padx=15, pady=15)
        
        # Left side (Title and timestamp)
        left_frame = tk.Frame(content, bg=Colors.BG_LIGHT)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        title_font = tkFont.Font(family="Segoe UI", size=12, weight="bold")
        title = tk.Label(
            left_frame,
            text=self.item.title,
            font=title_font,
            bg=Colors.BG_LIGHT,
            fg=Colors.TEXT_DARK,
            justify=tk.LEFT
        )
        title.pack(anchor=tk.W)
        
        timestamp_font = tkFont.Font(family="Segoe UI", size=9)
        timestamp = tk.Label(
            left_frame,
            text=self.item.timestamp,
            font=timestamp_font,
            bg=Colors.BG_LIGHT,
            fg=Colors.TEXT_LIGHT
        )
        timestamp.pack(anchor=tk.W, pady=2)
        
        # Right side (Amount)
        right_frame = tk.Frame(content, bg=Colors.BG_LIGHT)
        right_frame.pack(side=tk.RIGHT, padx=10)
        
        amount_color = Colors.ACCENT_GREEN if self.item.is_income else Colors.ACCENT_RED
        amount_prefix = "+" if self.item.is_income else "-"
        
        amount_font = tkFont.Font(family="Segoe UI", size=13, weight="bold")
        amount = tk.Label(
            right_frame,
            text=f"{amount_prefix}${self.item.amount:,.2f}",
            font=amount_font,
            bg=Colors.BG_LIGHT,
            fg=amount_color
        )
        amount.pack()
        
        # Delete button
        if self.on_delete:
            delete_btn = tk.Button(
                right_frame,
                text="✕",
                font=("Arial", 10),
                bg=Colors.ERROR_BG,
                fg=Colors.ERROR_TEXT,
                relief=tk.FLAT,
                cursor="hand2",
                command=lambda: self.on_delete(self.item.id),
                padx=8,
                pady=2
            )
            delete_btn.pack(pady=5)


class TransactionList(tk.Frame):
    """Professional scrollable transaction list"""
    
    def __init__(self, parent, on_delete: Callable = None):
        super().__init__(parent, bg=Colors.WHITE)
        self.on_delete = on_delete
        self.items_frame = None
        self.canvas = None
        self.scrollbar = None
        self.create_widgets()
    
    def create_widgets(self):
        """Create list widgets"""
        # Canvas with scrollbar
        self.canvas = tk.Canvas(self, bg=Colors.WHITE, highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient=tk.VERTICAL, command=self.canvas.yview)
        self.items_frame = tk.Frame(self.canvas, bg=Colors.WHITE)
        
        self.items_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas.create_window((0, 0), window=self.items_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    def add_item(self, item: ListItem):
        """Add item to list"""
        TransactionListItem(
            self.items_frame,
            item,
            on_delete=self.on_delete
        ).pack(fill=tk.X)
    
    def clear_items(self):
        """Clear all items"""
        for widget in self.items_frame.winfo_children():
            widget.destroy()
    
    def add_items(self, items: List[ListItem]):
        """Add multiple items"""
        self.clear_items()
        for item in items:
            self.add_item(item)


class SummaryPanel(tk.Frame):
    """Professional summary statistics panel"""
    
    def __init__(self, parent, summary_data: dict = None):
        super().__init__(parent, bg=Colors.WHITE)
        self.summary_data = summary_data or {}
        self.create_widgets()
    
    def create_widgets(self):
        """Create summary widgets"""
        container = tk.Frame(self, bg=Colors.WHITE)
        container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_font = tkFont.Font(family="Segoe UI", size=14, weight="bold")
        title = tk.Label(
            container,
            text="SUMMARY",
            font=title_font,
            bg=Colors.WHITE,
            fg=Colors.TEXT_DARK
        )
        title.pack(anchor=tk.W, pady=(0, 20))
        
        # Summary cards
        cards_frame = tk.Frame(container, bg=Colors.WHITE)
        cards_frame.pack(fill=tk.BOTH, expand=True)
        
        self.create_summary_card(
            cards_frame,
            "Total Income",
            f"${self.summary_data.get('total_income', 0):,.2f}",
            Colors.ACCENT_GREEN
        )
        
        self.create_summary_card(
            cards_frame,
            "Total Expenses",
            f"${self.summary_data.get('total_expenses', 0):,.2f}",
            Colors.ACCENT_RED
        )
        
        self.create_summary_card(
            cards_frame,
            "Transactions",
            str(self.summary_data.get('total_transactions', 0)),
            Colors.TEXT_DARK
        )
    
    def create_summary_card(self, parent, label: str, value: str, color: str):
        """Create individual summary card"""
        card = tk.Frame(parent, bg=Colors.BG_LIGHT, relief=tk.FLAT, highlightthickness=0)
        card.pack(fill=tk.X, pady=10)
        
        card_content = tk.Frame(card, bg=Colors.BG_LIGHT)
        card_content.pack(fill=tk.BOTH, expand=True, padx=15, pady=15)
        
        label_font = tkFont.Font(family="Segoe UI", size=10)
        label_widget = tk.Label(
            card_content,
            text=label,
            font=label_font,
            bg=Colors.BG_LIGHT,
            fg=Colors.TEXT_LIGHT
        )
        label_widget.pack(anchor=tk.W)
        
        value_font = tkFont.Font(family="Segoe UI", size=16, weight="bold")
        value_widget = tk.Label(
            card_content,
            text=value,
            font=value_font,
            bg=Colors.BG_LIGHT,
            fg=color
        )
        value_widget.pack(anchor=tk.W, pady=5)


class Header(tk.Frame):
    """Professional application header"""
    
    def __init__(self, parent, title: str = "FinanceTracker", subtitle: str = "v1.0.0"):
        super().__init__(parent, bg=Colors.BLACK, relief=tk.FLAT, highlightthickness=0)
        self.title = title
        self.subtitle = subtitle
        self.create_widgets()
    
    def create_widgets(self):
        """Create header widgets"""
        self.pack(fill=tk.X, padx=0, pady=0)
        
        content = tk.Frame(self, bg=Colors.BLACK)
        content.pack(fill=tk.X, padx=20, pady=20)
        
        # Logo and text container
        header_content = tk.Frame(content, bg=Colors.BLACK)
        header_content.pack(fill=tk.X)
        
        # Logo
        logo_font = ("Arial", 28)
        logo = tk.Label(
            header_content,
            text="💰",
            font=logo_font,
            bg=Colors.BLACK,
            fg=Colors.WHITE
        )
        logo.pack(side=tk.LEFT, padx=(0, 15))
        
        # Text content
        text_frame = tk.Frame(header_content, bg=Colors.BLACK)
        text_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        title_font = tkFont.Font(family="Segoe UI", size=FontSizes.HEADER_TITLE, weight="bold")
        title_label = tk.Label(
            text_frame,
            text=self.title,
            font=title_font,
            bg=Colors.BLACK,
            fg=Colors.WHITE
        )
        title_label.pack(anchor=tk.W)
        
        subtitle_font = tkFont.Font(family="Segoe UI", size=FontSizes.HEADER_SUBTITLE)
        subtitle_label = tk.Label(
            text_frame,
            text=self.subtitle,
            font=subtitle_font,
            bg=Colors.BLACK,
            fg=Colors.TEXT_LIGHT
        )
        subtitle_label.pack(anchor=tk.W)


class Footer(tk.Frame):
    """Professional application footer"""
    
    def __init__(self, parent, text: str = "© 2026 FinanceTracker. All rights reserved."):
        super().__init__(parent, bg=Colors.BG_LIGHTER, relief=tk.FLAT, highlightthickness=0)
        self.create_widgets(text)
    
    def create_widgets(self, text: str):
        """Create footer widgets"""
        self.pack(fill=tk.X, side=tk.BOTTOM)
        
        footer_font = tkFont.Font(family="Segoe UI", size=FontSizes.FOOTER_TEXT)
        footer_label = tk.Label(
            self,
            text=text,
            font=footer_font,
            bg=Colors.BG_LIGHTER,
            fg=Colors.TEXT_LIGHT,
            pady=20
        )
        footer_label.pack()


# ======================== MAIN APPLICATION ========================

class FinanceTrackerApp:
    """Main application controller"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("FinanceTracker")
        self.root.geometry("420x800")
        self.root.config(bg=Colors.PRIMARY_DARKER)
        
        # Show splash screen
        SplashScreen(root, duration=2000)
        
        self.setup_main_ui()
    
    def setup_main_ui(self):
        """Setup main UI after splash"""
        self.root.after(2000, self._build_main_interface)
    
    def _build_main_interface(self):
        """Build main interface"""
        # Container
        self.app_container = tk.Frame(
            self.root,
            bg=Colors.WHITE,
            width=420,
            height=800
        )
        self.app_container.pack(fill=