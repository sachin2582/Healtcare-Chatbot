"""
Timezone utilities for handling local time vs UTC time
"""
from datetime import datetime, timezone, timedelta
import pytz

# Define your local timezone (India Standard Time)
LOCAL_TIMEZONE = pytz.timezone('Asia/Kolkata')

def get_local_now():
    """Get current local time with timezone info"""
    return datetime.now(LOCAL_TIMEZONE)

def get_utc_now():
    """Get current UTC time with timezone info"""
    return datetime.now(timezone.utc)

def utc_to_local(utc_dt):
    """Convert UTC datetime to local timezone"""
    if utc_dt is None:
        return None
    
    # If datetime is naive (no timezone info), assume it's UTC
    if utc_dt.tzinfo is None:
        utc_dt = utc_dt.replace(tzinfo=timezone.utc)
    
    # Convert to local timezone
    return utc_dt.astimezone(LOCAL_TIMEZONE)

def local_to_utc(local_dt):
    """Convert local datetime to UTC"""
    if local_dt is None:
        return None
    
    # If datetime is naive (no timezone info), assume it's local time
    if local_dt.tzinfo is None:
        local_dt = LOCAL_TIMEZONE.localize(local_dt)
    
    # Convert to UTC
    return local_dt.astimezone(timezone.utc)

def format_datetime_for_display(dt):
    """Format datetime for display in local timezone"""
    if dt is None:
        return None
    
    # Convert to local time if it's UTC
    local_dt = utc_to_local(dt)
    return local_dt.strftime('%Y-%m-%d %H:%M:%S')

def get_timezone_offset():
    """Get the timezone offset in hours"""
    now_utc = datetime.now(timezone.utc)
    now_local = datetime.now(LOCAL_TIMEZONE)
    offset = now_local.utcoffset()
    return offset.total_seconds() / 3600
