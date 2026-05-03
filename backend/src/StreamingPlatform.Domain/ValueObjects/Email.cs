using System.Text.RegularExpressions;

namespace StreamingPlatform.Domain.ValueObjects;

public class Email : IEquatable<Email>
{
    public string Value { get; private set; }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || !IsValidEmail(value))
            throw new ArgumentException("Invalid email address", nameof(value));

        Value = value.ToLower();
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public override string ToString() => Value;

    public override bool Equals(object? obj) => Equals(obj as Email);

    public bool Equals(Email? other) => other?.Value == Value;

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(Email? left, Email? right) => Equals(left, right);

    public static bool operator !=(Email? left, Email? right) => !Equals(left, right);
}
